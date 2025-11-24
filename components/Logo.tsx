import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="cursor-pointer flex-shrink-0 flex items-center">
      <div className="relative h-10 w-32 md:w-40">
        <Image
          src="/workflow.svg"
          alt="Workflow Logo"
          fill
          className="object-contain object-center"
          priority
          sizes="(max-width: 768px) 128px, 160px"
        />
      </div>
    </Link>
  );
};

export default Logo;