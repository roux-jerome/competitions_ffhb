export function Tags({tags}: { tags: string[] }) {
    return <div className="flex justify-end pt-5 text-xs font-light text-gray-500">
        {
            tags.map(tag =>
                <span key={tag}
                   className="ml-3 inline-flex items-center px-2.5 py-0.5 focus:outline-none focus:ring-2 focus:ring-orange-200  focus:ring-ring focus:ring-offset-2 hover:cursor-default"
                   tabIndex={0} role="button">{tag}</span>
            )
        }
    </div>
}