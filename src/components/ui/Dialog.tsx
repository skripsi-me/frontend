import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

/**
 * @description Root dialog component wrapper from Radix UI.
 */
const Dialog = DialogPrimitive.Root

/**
 * @description Dialog trigger button wrapper.
 */
const DialogTrigger = DialogPrimitive.Trigger

/**
 * @description Dialog portal component wrapper.
 */
const DialogPortal = DialogPrimitive.Portal

/**
 * @description Dialog close button wrapper.
 */
const DialogClose = DialogPrimitive.Close

/**
 * @description Dialog overlay component with smooth backdrop fade in/out animation.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>} props Component properties.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>} ref React forward reference.
 * @return {React.JSX.Element} Rendered DialogOverlay.
 */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/**
 * @description Dialog content component rendering the main modal body.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>} props Component properties.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>} ref React forward reference.
 * @return {React.JSX.Element} Rendered DialogContent.
 */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#E5E7EB] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-40 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-40 rounded-md focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#00AA5B]/20 disabled:pointer-events-none cursor-pointer p-1">
        <X className="h-5 w-5 text-[#080808]" />
        <span className="sr-only">Tutup</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/**
 * @description Dialog header component wrapper for grouping titles and descriptions.
 * @param {React.HTMLAttributes<HTMLDivElement>} props HTML div properties.
 * @return {React.JSX.Element} Rendered DialogHeader.
 */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

/**
 * @description Dialog footer component wrapper for buttons at the bottom.
 * @param {React.HTMLAttributes<HTMLDivElement>} props HTML div properties.
 * @return {React.JSX.Element} Rendered DialogFooter.
 */
const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/**
 * @description Dialog title component wrapper.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>} props Component properties.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Title>>} ref React forward reference.
 * @return {React.JSX.Element} Rendered DialogTitle.
 */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-bold leading-none tracking-tight text-[#080808]",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/**
 * @description Dialog description component wrapper.
 * @param {React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>} props Component properties.
 * @param {React.Ref<React.ElementRef<typeof DialogPrimitive.Description>>} ref React forward reference.
 * @return {React.JSX.Element} Rendered DialogDescription.
 */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-[#6B7280] font-semibold", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
