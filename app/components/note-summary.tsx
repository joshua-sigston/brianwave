interface Note {
    id: string
    title: string
    content: string
    summary: string | null
}

export default function NoteSummary({note}: {note: Note}) {
    return (
        <div>
            {!note.summary ? (
                <p>
                    No summary available.
                </p>
            ) : (
                <p>{note.summary}</p>
            )}
        </div>
    )
}