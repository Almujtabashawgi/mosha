import { Spinner } from './ui';

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-brand-600" role="status" aria-live="polite">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
