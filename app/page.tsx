
// app/page.tsx
import Appbar from "../components/Appbar";
import TransferForm from "../components/TransferForm";

export default function Home() {
  return (
    <main>
      <Appbar />
      <TransferForm />
    </main>
  );
}