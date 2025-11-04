import { Loader2Icon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

function ButtonLoading({ type, className, text, loading, onClick, ...props }) {
  return (
    <Button
      size="sm"
      className={cn("", className)}
      type={type}
      disabled={loading}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2Icon className="animate-spin" />}
      {text}
    </Button>
  );
}

export default ButtonLoading;
