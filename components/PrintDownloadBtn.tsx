'use client';

import { Button } from "./ui/button";

export default function PrintDownloadBtn() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
    onClick={handlePrint}
    >
    Print / Download
    </Button>
  );
}