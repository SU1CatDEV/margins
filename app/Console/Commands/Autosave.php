<?php

namespace App\Console\Commands;

use App\Models\Book;
use App\Models\CentralSaverRepo;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Console\Event\ConsoleTerminateEvent;
use Symfony\Component\Console\Output\ConsoleOutput;
use Symfony\Component\Console\Command\SignalableCommandInterface;

class Autosave extends Command implements SignalableCommandInterface
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'autosave:run';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs the autosave job';

    private bool $running = true;

    private function handleDiffTransfer($sessionData) {
        if ($sessionData['diffs']) {
            $currentBook = Book::find($sessionData["book_id"]);
            $mergedDiffs = CentralSaverRepo::collapseDiffs(array_merge($currentBook->state, $sessionData['diffs']));
                    
            $currentBook->state = $mergedDiffs;
            $currentBook->save();
            CentralSaverRepo::clearDiffs($sessionData['id']);
        }

        if (CentralSaverRepo::shouldClear($sessionData["book_id"])){
            CentralSaverRepo::clear($sessionData["book_id"]);
        }
    }

    public function handle()
    {
        $output = new ConsoleOutput();
        $output->writeln('<info>Service started. Press Ctrl+C to exit...</info>');

        while ($this->running) {
            $data = CentralSaverRepo::all()->toArray();
            foreach ($data as $sessionData) {
                self::handleDiffTransfer($sessionData);
            }
            sleep(120);
        }
    }

    public function getSubscribedSignals(): array
    {
        if (! windows_os()) {
            return [SIGINT, SIGTERM, SIGTSTP];
        }

        $this->handleSignalWindows();

        return [];
    }

    public function handleSignal(int $signal = 0, int|false $previousExitCode = 0): int|false
    {
        $this->components->info('Stopping the runner...');

        $data = CentralSaverRepo::all()->toArray();
        foreach ($data as $sessionData) {
            self::handleDiffTransfer($sessionData);
        }

        return $previousExitCode;
    }

    public function handleSignalWindows(): void
    {
        if (function_exists('sapi_windows_set_ctrl_handler')) {
            sapi_windows_set_ctrl_handler(fn () => exit($this->handleSignal()));
        }
    }
}
