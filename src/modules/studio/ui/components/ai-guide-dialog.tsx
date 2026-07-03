"use client";

import { useState } from "react";
import { SparklesIcon, FileTextIcon, ImageIcon, RefreshCwIcon, Clock3Icon, CheckCircle2Icon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AIGuideDialogProps {
  videoId: string;
}

const steps = [
  {
    icon: SparklesIcon,
    title: "Generate a title",
    description: "Click the spark icon next to the title field. Wait about 1–3 minutes for the title to be created.",
  },
  {
    icon: FileTextIcon,
    title: "Generate a description",
    description: "Use the spark icon next to the description box. This usually takes about 1–3 minutes.",
  },
  {
    icon: ImageIcon,
    title: "Generate an AI thumbnail",
    description: "Open the thumbnail tools and create a thumbnail. This can take around 2–5 minutes depending on the request.",
  },
  {
    icon: RefreshCwIcon,
    title: "Revalidate after AI changes",
    description: "After the AI finishes, click the refresh button at the top-right to revalidate and reload the latest title, description, and thumbnail.",
  },
];

export const AIGuideDialog = ({ videoId }: AIGuideDialogProps) => {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;

    const storageKey = `studio_ai_guide_seen_${videoId}`;
    return !window.localStorage.getItem(storageKey);
  });

  const handleClose = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`studio_ai_guide_seen_${videoId}`, "true");
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleClose();
      }
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <Clock3Icon className="size-4" />
            First-time guide for AI tools
          </div>
          <DialogTitle className="text-2xl">How to use the AI features</DialogTitle>
          <DialogDescription>
            This guide will appear only once for this video so you can quickly understand the full flow.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="flex gap-3 rounded-lg border border-border/70 bg-muted/30 p-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-600/10 text-red-600">
                  <Icon className="size-4" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{step.title}</p>
                    <span className="text-xs text-muted-foreground">Step {index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2Icon className="size-4" />
            Tip
          </div>
          <p className="mt-1">
            AI generation may take a little while. If the title, description, or thumbnail does not appear right away, wait a bit and then click the refresh button to revalidate.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleClose}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
