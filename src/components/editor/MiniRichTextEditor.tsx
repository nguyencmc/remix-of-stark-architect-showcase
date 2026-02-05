 import { useEditor, EditorContent } from '@tiptap/react';
 import StarterKit from '@tiptap/starter-kit';
 import Underline from '@tiptap/extension-underline';
 import Highlight from '@tiptap/extension-highlight';
 import Image from '@tiptap/extension-image';
 import Link from '@tiptap/extension-link';
 import { cn } from '@/lib/utils';
 import { Button } from '@/components/ui/button';
 import { Toggle } from '@/components/ui/toggle';
 import {
   Bold,
   Italic,
   Underline as UnderlineIcon,
   Highlighter,
   Image as ImageIcon,
   Subscript,
   Superscript,
   Link as LinkIcon,
   Unlink,
 } from 'lucide-react';
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from '@/components/ui/popover';
 import { Input } from '@/components/ui/input';
 import { useState, useCallback, useEffect } from 'react';
 import SubScript from '@tiptap/extension-subscript';
 import SuperScript from '@tiptap/extension-superscript';
 
 interface MiniRichTextEditorProps {
   content: string;
   onChange: (content: string) => void;
   placeholder?: string;
   className?: string;
   minHeight?: string;
   onImageUpload?: (file: File) => Promise<string>;
   showImageUpload?: boolean;
 }
 
 export const MiniRichTextEditor = ({
   content,
   onChange,
   placeholder = 'Nhập nội dung...',
   className,
   minHeight = '80px',
   onImageUpload,
   showImageUpload = false,
 }: MiniRichTextEditorProps) => {
   const [linkUrl, setLinkUrl] = useState('');
   const [imageUrl, setImageUrl] = useState('');
   const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
   const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
 
   const editor = useEditor({
     extensions: [
       StarterKit.configure({
         heading: false,
         codeBlock: false,
         blockquote: false,
         bulletList: false,
         orderedList: false,
         horizontalRule: false,
       }),
       Underline,
       Highlight.configure({
         multicolor: false,
       }),
       Image.configure({
         HTMLAttributes: {
           class: 'max-w-full h-auto rounded inline-block',
         },
         inline: true,
       }),
       Link.configure({
         openOnClick: false,
         HTMLAttributes: {
           class: 'text-primary underline',
         },
       }),
       SubScript,
       SuperScript,
     ],
     content,
     editorProps: {
       attributes: {
         class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-3',
         style: `min-height: ${minHeight}`,
       },
     },
     onUpdate: ({ editor }) => {
       onChange(editor.getHTML());
     },
   });
 
   useEffect(() => {
     if (editor && content !== editor.getHTML()) {
       editor.commands.setContent(content);
     }
   }, [content, editor]);
 
   const addLink = useCallback(() => {
     if (linkUrl && editor) {
       editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
       setLinkUrl('');
       setIsLinkPopoverOpen(false);
     }
   }, [editor, linkUrl]);
 
   const removeLink = useCallback(() => {
     if (editor) {
       editor.chain().focus().unsetLink().run();
     }
   }, [editor]);
 
   const addImage = useCallback(() => {
     if (imageUrl && editor) {
       editor.chain().focus().setImage({ src: imageUrl }).run();
       setImageUrl('');
       setIsImagePopoverOpen(false);
     }
   }, [editor, imageUrl]);
 
   const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (file && onImageUpload && editor) {
       try {
         const url = await onImageUpload(file);
         editor.chain().focus().setImage({ src: url }).run();
         setIsImagePopoverOpen(false);
       } catch (error) {
         console.error('Failed to upload image:', error);
       }
     }
   }, [editor, onImageUpload]);
 
   if (!editor) {
     return null;
   }
 
   return (
     <div className={cn('mini-rich-text-editor rounded-md border border-input bg-background', className)}>
       {/* Compact Toolbar */}
       <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-border bg-muted/30">
         <Toggle
           size="sm"
           pressed={editor.isActive('bold')}
           onPressedChange={() => editor.chain().focus().toggleBold().run()}
           className="h-7 w-7 p-0"
         >
           <Bold className="h-3.5 w-3.5" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('italic')}
           onPressedChange={() => editor.chain().focus().toggleItalic().run()}
           className="h-7 w-7 p-0"
         >
           <Italic className="h-3.5 w-3.5" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('underline')}
           onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
           className="h-7 w-7 p-0"
         >
           <UnderlineIcon className="h-3.5 w-3.5" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('highlight')}
           onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
           className="h-7 w-7 p-0"
         >
           <Highlighter className="h-3.5 w-3.5" />
         </Toggle>
 
         <div className="w-px h-5 bg-border mx-1" />
 
         <Toggle
           size="sm"
           pressed={editor.isActive('subscript')}
           onPressedChange={() => editor.chain().focus().toggleSubscript().run()}
           className="h-7 w-7 p-0"
           title="Chỉ số dưới"
         >
           <Subscript className="h-3.5 w-3.5" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('superscript')}
           onPressedChange={() => editor.chain().focus().toggleSuperscript().run()}
           className="h-7 w-7 p-0"
           title="Chỉ số trên"
         >
           <Superscript className="h-3.5 w-3.5" />
         </Toggle>
 
         <div className="w-px h-5 bg-border mx-1" />
 
         {/* Link */}
         <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
           <PopoverTrigger asChild>
             <Toggle
               size="sm"
               pressed={editor.isActive('link')}
               className="h-7 w-7 p-0"
             >
               <LinkIcon className="h-3.5 w-3.5" />
             </Toggle>
           </PopoverTrigger>
           <PopoverContent className="w-72">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium">URL</label>
               <div className="flex gap-2">
                 <Input
                   placeholder="https://..."
                   value={linkUrl}
                   onChange={(e) => setLinkUrl(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && addLink()}
                   className="h-8 text-sm"
                 />
                 <Button size="sm" className="h-8" onClick={addLink}>
                   OK
                 </Button>
               </div>
             </div>
           </PopoverContent>
         </Popover>
         {editor.isActive('link') && (
           <Button
             variant="ghost"
             size="icon"
             className="h-7 w-7"
             onClick={removeLink}
           >
             <Unlink className="h-3.5 w-3.5" />
           </Button>
         )}
 
         {/* Image - only show if enabled */}
         {showImageUpload && (
           <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
             <PopoverTrigger asChild>
               <Button variant="ghost" size="icon" className="h-7 w-7">
                 <ImageIcon className="h-3.5 w-3.5" />
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-72">
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-medium">Thêm hình ảnh</label>
                 <div className="flex gap-2">
                   <Input
                     placeholder="URL hình ảnh"
                     value={imageUrl}
                     onChange={(e) => setImageUrl(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && addImage()}
                     className="h-8 text-sm"
                   />
                   <Button size="sm" className="h-8" onClick={addImage}>
                     OK
                   </Button>
                 </div>
                 {onImageUpload && (
                   <>
                     <div className="relative">
                       <div className="absolute inset-0 flex items-center">
                         <span className="w-full border-t" />
                       </div>
                       <div className="relative flex justify-center text-xs uppercase">
                         <span className="bg-popover px-2 text-muted-foreground">hoặc</span>
                       </div>
                     </div>
                     <Input
                       type="file"
                       accept="image/*"
                       onChange={handleImageUpload}
                       className="h-8 text-sm"
                     />
                   </>
                 )}
               </div>
             </PopoverContent>
           </Popover>
         )}
       </div>
 
       {/* Editor Content */}
       <EditorContent editor={editor} />
     </div>
   );
 };
 
 export default MiniRichTextEditor;