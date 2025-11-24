import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/" className="cursor-pointer flex-shrink-0 block">
      <div className="relative h-8 w-28 md:h-9 md:w-32">
        <Image
          src="/workflow.svg"
          alt="Workflow Logo"
          fill
          className="object-contain object-left"
          priority
          sizes="(max-width: 768px) 112px, 128px"
        />
      </div>
    </Link>
  );
};

export default Logo;