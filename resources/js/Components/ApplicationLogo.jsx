export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center font-bold text-white text-lg">
                ✨
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
                ContentGen
            </span>
        </div>
    );
}
