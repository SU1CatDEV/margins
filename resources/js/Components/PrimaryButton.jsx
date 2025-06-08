export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md
                bg-blue-200 border-2 border-2 border-blue-300 tracking-wider
                apply-cursive transition duration-150 ease-in-out 
                hover:bg-blue-300 hover:border-blue-400
                focus:bg-blue-200 focus:border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-600
                active:bg-blue-300 active:border-blue-400
                
                dark:bg-gray-200 dark:text-gray-800 
                dark:hover:bg-white 
                dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300
                
                disabled:bg-gray-300 disabled:border-gray-400 disabled:cursor-not-allowed ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
