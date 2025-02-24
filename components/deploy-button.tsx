import Link from 'next/link';
export const DeployButton = () => (
  <Link
    href={`https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-reasoning%2Ftree%2Fmain&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20key&envLink=https%3A%2F%2Fconsole.anthropic.com%2F`}
    target="_blank"
    rel="noopener noreferrer"
    className="block ml-2"
  >
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
  </Link>
);
