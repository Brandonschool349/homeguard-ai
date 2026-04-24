type Props = {
  message: string;
};

export default function ErrorBanner({ message }: Props) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2 mx-6 mt-4 rounded-lg">
      ⚠️ {message}
    </div>
  );
}