export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-slate-600 bg-slate-700 text-indigo-500 shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 ' +
                className
            }
        />
    );
}
