import Link from 'next/link';

export function Footnote() {
  return (
    <div className="text-xs text-zinc-400 leading-5 hidden sm:block">
      This preview is built using{' '}
      <Link
        className="underline underline-offset-2"
        href="https://nextjs.org/"
        target="_blank"
      >
        Next.js
      </Link>{' '}
      and the{' '}
      <Link
        className="underline underline-offset-2"
        href="https://sdk.vercel.ai/"
        target="_blank"
      >
        AI SDK
      </Link>
      . Read more about how to use reasoning models in your applications in our{' '}
      <Link
        className="underline underline-offset-2"
        href="https://sdk.vercel.ai/docs/ai-sdk-ui/chatbot#reasoning"
        target="_blank"
      >
        documentation
      </Link>
      .
    </div>
  );
}
