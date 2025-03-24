import { Components } from "react-markdown";
import Link from "next/link";

export const markdownComponents: Partial<Components> = {
  p: ({ children }) => {
    const isPreTag = Array.isArray(children) && children.length > 0 && (children[0] as any)?.type === "pre";
    if (isPreTag) {
      return <>{children}</>;
    }
    return <p className="leading-6">{children}</p>;
  },
  pre: ({ children }) => (
    <pre className="overflow-x-auto p-4 bg-zinc-900 text-white rounded-lg">
      {children}
    </pre>
  ),
  ol: ({ children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return match ? (
      <pre className="overflow-x-auto p-4 bg-zinc-900 text-white rounded-lg">
        <code className={`language-${match[1]}`}>{children}</code>
      </pre>
    ) : (
      <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-md">
        {children}
      </code>
    );
  },
  li: ({ children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ children, ...props }) => {
    return (
      // @ts-expect-error - Link component expects href prop from markdown-parsed anchor tags
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
};
