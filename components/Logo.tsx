import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="cursor-pointer">
      <Image
        src="/workflow.svg"
        alt="Workflow Logo"
        width={100}
        height={28}
        className="h-5 md:h-6 w-auto"
        priority
      />
    </Link>
  );
};

export default Logo;
