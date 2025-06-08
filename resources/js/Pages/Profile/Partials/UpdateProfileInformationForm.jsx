import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import Select from '@/Components/Select';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            username: user.username,
            education: user.education,
            work: user.work,
            pronouns: user.pronouns,
            email: user.email,
            bio: user.bio,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6 w-full">
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 w-full'>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoComplete="name"
                            isFocused
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="username" value="Username" />

                        <div className='relative'>
                            <span className='absolute top-[1.5px] left-3 border-r-2 border-gray-300 pr-2 pt-2 pb-2'>@</span>
                            <TextInput
                                id="username"
                                className="mt-1 block w-full pl-11"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="username"
                            />
                        </div>

                        <InputError className="mt-2" message={errors.username} />
                    </div>

                    <div>
                        <InputLabel htmlFor="education" value="Education" />

                        <TextInput
                            id="education"
                            className="mt-1 block w-full"
                            value={data.education}
                            onChange={(e) => setData('education', e.target.value)}
                            required
                        />

                        <InputError className="mt-2" message={errors.education} />
                    </div>

                    <div>
                        <InputLabel htmlFor="work" value="Work" />

                        <TextInput
                            id="work"
                            className="mt-1 block w-full"
                            value={data.work}
                            onChange={(e) => setData('work', e.target.value)}
                            required
                        />

                        <InputError className="mt-2" message={errors.work} />
                    </div>

                    <div>
                        <InputLabel htmlFor="pronouns" value="Pronouns" />

                        <Select
                            id="pronouns"
                            className="mt-1 block w-full"
                            value={data.pronouns}
                            onChange={(e) => setData('pronouns', e.target.value)}
                            required
                        >
                            <option name="she">she/her</option>
                            <option name="he">he/him</option>
                            <option name="they">they/them</option>
                        </Select>

                        <InputError className="mt-2" message={errors.pronouns} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />
                    
                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="bio" value="Bio" />

                    <TextArea
                        id="bio"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.bio}
                        onChange={(e) => setData('bio', e.target.value)}
                        required
                    />

                    <InputError className="mt-2" message={errors.bio} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton className='btn-large' disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
