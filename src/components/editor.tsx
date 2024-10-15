import { Delta, Op } from "quill/core";
import { MdSend } from "react-icons/md";
import { PiTextAa } from "react-icons/pi";
import Quill, { QuillOptions } from "quill";
import { ImageIcon, Smile } from "lucide-react";
import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

import { Hint } from "./hint";
import { Button } from "./ui/button";

import "quill/dist/quill.snow.css";

type EditorValue = {
  image: File | null;
  body: string;
};

interface EditorProps {
  disabled?: boolean;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: Delta | Op[];
  variant?: "create" | "update";
  innerRef?: MutableRefObject<Quill | null>;
  onSubmit: ({ image, body }: EditorValue) => void;
}

const Editor = ({
  disabled = false,
  onCancel,
  placeholder = "Write something...",
  defaultValue = [],
  variant = "create",
  innerRef,
  onSubmit,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  const submitRef = useRef(onSubmit);
  const disabledRef = useRef(disabled);
  const placeholderRef = useRef(placeholder);
  const quillRef = useRef<Quill | null>(null);
  const defaultValueRef = useRef(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    disabledRef.current = disabled;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const editorContainer = container.appendChild(
      container.ownerDocument.createElement("div"),
    );

    const options: QuillOptions = {
      theme: "snow",
      placeholder: placeholderRef.current,
      modules: {
        toolbar: [
          ["bold", "italic", "strike"],
          ["link"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
        keyboard: {
          bindings: {
            enter: {
              key: "Enter",
              handler: () => {
                //TODO: Submit form
              },
            },
            shift_enter: {
              key: "Enter",
              shiftKey: true,
              handler: () => {
                quill.insertText(quill.getSelection()?.index || 0, "\n");
              },
            },
          },
        },
      },
    };

    const quill = new Quill(editorContainer, options);

    quillRef.current = quill;
    quillRef.current.focus();

    if (innerRef) {
      innerRef.current = quill;
    }

    quill.setContents(defaultValueRef.current);

    setText(quill.getText());
    quill.on(Quill.events.TEXT_CHANGE, () => {
      setText(quill.getText());
    });

    return () => {
      quill.off(Quill.events.TEXT_CHANGE);

      if (quillRef.current) {
        quillRef.current = null;
      }

      if (innerRef) {
        innerRef.current = null;
      }

      if (container) {
        container.innerHTML = "";
      }
    };
  }, [innerRef]);

  const toggleToolbar = () => {
    setIsToolbarVisible((current) => !current);
    const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

    if (toolbarElement) {
      toolbarElement.classList.toggle("hidden");
    }
  };

  const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  return (
    <div className="flex flex-col">
      <div className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition focus-within:border-slate-300 focus-within:shadow-sm">
        <div ref={containerRef} className="ql-custom h-full" />
        <div className="z-[5] flex px-2 pb-2">
          <Hint
            label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
          >
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={toggleToolbar}
            >
              <PiTextAa className="size-4" />
            </Button>
          </Hint>
          <Hint label="Emoji">
            <Button
              disabled={disabled}
              size="iconSm"
              variant="ghost"
              onClick={() => {}}
            >
              <Smile className="size-4" />
            </Button>
          </Hint>
          {variant === "create" && (
            <Hint label="Image">
              <Button
                disabled={disabled}
                size="iconSm"
                variant="ghost"
                onClick={() => {}}
              >
                <ImageIcon className="size-4" />
              </Button>
            </Hint>
          )}
          {variant === "update" && (
            <div className="ml-auto flex items-center gap-x-2">
              <Button
                size="sm"
                disabled={disabled}
                variant="outline"
                onClick={() => {}}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                disabled={disabled || isEmpty}
                onClick={() => {}}
                className="bg-[#007a5a] text-white hover:bg-[#007a5a]/80"
              >
                Save
              </Button>
            </div>
          )}
          {variant === "create" && (
            <Button
              size="iconSm"
              disabled={disabled || isEmpty}
              onClick={() => {}}
              className={cn(
                "ml-auto",
                isEmpty
                  ? "bg-white text-muted-foreground hover:bg-white"
                  : "bg-[#007a5a] text-white hover:bg-[#007a5a]/80",
              )}
            >
              <MdSend className="size-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-end p-2 text-[10px] text-muted-foreground">
        <p>
          <strong>Shift + Return</strong> to add a new line
        </p>
      </div>
    </div>
  );
};

export default Editor;
