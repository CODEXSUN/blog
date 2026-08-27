import {
  createContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useId,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "outline";
};

export function Button({ className = "", variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={`codexsun-addon-button codexsun-addon-button-${variant} ${className}`.trim()}
      {...props}
    />
  );
}

export function WorkspacePage({
  actions,
  children,
  description,
  title,
}: {
  actions?: ReactNode;
  children: ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <main className="codexsun-addon-page">
      <header className="codexsun-addon-page-header">
        <div>
          <h1>{title}</h1>
          {description ? <p>{description}</p> : null}
        </div>
        {actions ? <div>{actions}</div> : null}
      </header>
      {children}
    </main>
  );
}

export function WorkspaceAutocomplete({
  loading,
  onChange,
  options,
  placeholder,
  value,
}: {
  loading?: boolean;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  value: string;
}) {
  const listId = useId();
  const selected = options.find((option) => option.value === value);
  return (
    <>
      <input
        className="codexsun-addon-autocomplete"
        disabled={loading}
        list={listId}
        placeholder={loading ? "Loading…" : placeholder}
        value={selected?.label ?? value}
        onChange={(event) => {
          const next = options.find(
            (option) => option.label === event.target.value || option.value === event.target.value,
          );
          onChange(next?.value ?? event.target.value);
        }}
      />
      <datalist id={listId}>
        {options.map((option) => (
          <option key={option.value} value={option.label} />
        ))}
      </datalist>
    </>
  );
}

type DialogState = { close: () => void };
const DialogContext = createContext<DialogState | null>(null);

export function Dialog({
  children,
  onOpenChange,
  open,
}: {
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onOpenChange, open]);

  if (!open) return null;
  return (
    <DialogContext.Provider value={{ close: () => onOpenChange(false) }}>
      <div
        className="codexsun-addon-dialog-backdrop"
        role="presentation"
        onMouseDown={(event) => {
          if (event.currentTarget === event.target) onOpenChange(false);
        }}
      >
        {children}
      </div>
    </DialogContext.Provider>
  );
}

export function DialogContent({
  className = "",
  onMouseDown,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section
      aria-modal="true"
      className={`codexsun-addon-dialog ${className}`.trim()}
      role="dialog"
      onMouseDown={(event) => {
        event.stopPropagation();
        onMouseDown?.(event);
      }}
      {...props}
    />
  );
}

export function DialogHeader(props: HTMLAttributes<HTMLDivElement>) {
  return <header className="codexsun-addon-dialog-header" {...props} />;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2>{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}

export function DialogClose(props: ButtonProps) {
  const dialog = useContext(DialogContext);
  return (
    <Button
      aria-label="Close dialog"
      type="button"
      variant="ghost"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        dialog?.close();
      }}
    />
  );
}

export const AlertDialog = Dialog;
export const AlertDialogContent = DialogContent;
export const AlertDialogHeader = DialogHeader;
export const AlertDialogTitle = DialogTitle;
export const AlertDialogDescription = DialogDescription;

export function AlertDialogFooter(props: HTMLAttributes<HTMLDivElement>) {
  return <footer className="codexsun-addon-dialog-footer" {...props} />;
}

export function AlertDialogCancel(props: ButtonProps) {
  const dialog = useContext(DialogContext);
  return (
    <Button
      type="button"
      variant="outline"
      {...props}
      onClick={(event) => {
        props.onClick?.(event);
        dialog?.close();
      }}
    />
  );
}

export function AlertDialogAction(props: ButtonProps) {
  return <Button type="button" {...props} />;
}
