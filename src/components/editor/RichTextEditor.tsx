 import { useEditor, EditorContent } from '@tiptap/react';
 import StarterKit from '@tiptap/starter-kit';
 import Underline from '@tiptap/extension-underline';
 import Link from '@tiptap/extension-link';
 import TextAlign from '@tiptap/extension-text-align';
 import Highlight from '@tiptap/extension-highlight';
 import Image from '@tiptap/extension-image';
 import { Table } from '@tiptap/extension-table';
 import TableRow from '@tiptap/extension-table-row';
 import TableCell from '@tiptap/extension-table-cell';
 import TableHeader from '@tiptap/extension-table-header';
 import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
 import { TextStyle } from '@tiptap/extension-text-style';
 import Color from '@tiptap/extension-color';
 import { common, createLowlight } from 'lowlight';
 import { cn } from '@/lib/utils';
 import { Button } from '@/components/ui/button';
 import { Toggle } from '@/components/ui/toggle';
 import { Separator } from '@/components/ui/separator';
 import {
   Bold,
   Italic,
   Underline as UnderlineIcon,
   Strikethrough,
   Code,
   Heading1,
   Heading2,
   Heading3,
   List,
   ListOrdered,
   Quote,
   AlignLeft,
   AlignCenter,
   AlignRight,
   AlignJustify,
   Link as LinkIcon,
   Unlink,
   Image as ImageIcon,
   Table as TableIcon,
   Highlighter,
   Undo,
   Redo,
   Minus,
   Plus,
   Trash2,
 } from 'lucide-react';
 import {
   Popover,
   PopoverContent,
   PopoverTrigger,
 } from '@/components/ui/popover';
 import { Input } from '@/components/ui/input';
 import { useState, useCallback, useEffect } from 'react';
 import './RichTextEditor.css';
 
 const lowlight = createLowlight(common);
 
 interface RichTextEditorProps {
   content: string;
   onChange: (content: string) => void;
   placeholder?: string;
   className?: string;
   minHeight?: string;
   onImageUpload?: (file: File) => Promise<string>;
 }
 
 export const RichTextEditor = ({
   content,
   onChange,
   placeholder = 'Bắt đầu viết nội dung...',
   className,
   minHeight = '300px',
   onImageUpload,
 }: RichTextEditorProps) => {
   const [linkUrl, setLinkUrl] = useState('');
   const [imageUrl, setImageUrl] = useState('');
   const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
   const [isImagePopoverOpen, setIsImagePopoverOpen] = useState(false);
 
   const editor = useEditor({
     extensions: [
       StarterKit.configure({
         codeBlock: false,
         heading: {
           levels: [1, 2, 3],
         },
       }),
       Underline,
       Link.configure({
         openOnClick: false,
         HTMLAttributes: {
           class: 'text-primary underline cursor-pointer',
         },
       }),
       TextAlign.configure({
         types: ['heading', 'paragraph'],
       }),
       Highlight.configure({
         multicolor: true,
       }),
       Image.configure({
         HTMLAttributes: {
           class: 'max-w-full h-auto rounded-lg',
         },
       }),
       Table.configure({
         resizable: true,
         HTMLAttributes: {
           class: 'border-collapse table-auto w-full',
         },
       }),
       TableRow,
       TableCell.configure({
         HTMLAttributes: {
           class: 'border border-border p-2',
         },
       }),
       TableHeader.configure({
         HTMLAttributes: {
           class: 'border border-border p-2 bg-muted font-bold',
         },
       }),
       CodeBlockLowlight.configure({
         lowlight,
         HTMLAttributes: {
           class: 'bg-muted rounded-lg p-4 font-mono text-sm',
         },
       }),
       TextStyle,
       Color,
     ],
     content,
     editorProps: {
       attributes: {
         class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none p-4',
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
 
   const insertTable = useCallback(() => {
     if (editor) {
       editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
     }
   }, [editor]);
 
   if (!editor) {
     return null;
   }
 
   return (
     <div className={cn('rich-text-editor rounded-lg border border-input bg-background', className)}>
       {/* Toolbar */}
       <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-muted/50">
         {/* Undo/Redo */}
         <Button
           variant="ghost"
           size="icon"
           className="h-8 w-8"
           onClick={() => editor.chain().focus().undo().run()}
           disabled={!editor.can().undo()}
         >
           <Undo className="h-4 w-4" />
         </Button>
         <Button
           variant="ghost"
           size="icon"
           className="h-8 w-8"
           onClick={() => editor.chain().focus().redo().run()}
           disabled={!editor.can().redo()}
         >
           <Redo className="h-4 w-4" />
         </Button>
 
         <Separator orientation="vertical" className="mx-1 h-6" />
 
         {/* Text Formatting */}
         <Toggle
           size="sm"
           pressed={editor.isActive('bold')}
           onPressedChange={() => editor.chain().focus().toggleBold().run()}
         >
           <Bold className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('italic')}
           onPressedChange={() => editor.chain().focus().toggleItalic().run()}
         >
           <Italic className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('underline')}
           onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
         >
           <UnderlineIcon className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('strike')}
           onPressedChange={() => editor.chain().focus().toggleStrike().run()}
         >
           <Strikethrough className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('highlight')}
           onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
         >
           <Highlighter className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('code')}
           onPressedChange={() => editor.chain().focus().toggleCode().run()}
         >
           <Code className="h-4 w-4" />
         </Toggle>
 
         <Separator orientation="vertical" className="mx-1 h-6" />
 
         {/* Headings */}
         <Toggle
           size="sm"
           pressed={editor.isActive('heading', { level: 1 })}
           onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
         >
           <Heading1 className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('heading', { level: 2 })}
           onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
         >
           <Heading2 className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('heading', { level: 3 })}
           onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
         >
           <Heading3 className="h-4 w-4" />
         </Toggle>
 
         <Separator orientation="vertical" className="mx-1 h-6" />
 
         {/* Lists */}
         <Toggle
           size="sm"
           pressed={editor.isActive('bulletList')}
           onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
         >
           <List className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('orderedList')}
           onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
         >
           <ListOrdered className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive('blockquote')}
           onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
         >
           <Quote className="h-4 w-4" />
         </Toggle>
 
         <Separator orientation="vertical" className="mx-1 h-6" />
 
         {/* Text Align */}
         <Toggle
           size="sm"
           pressed={editor.isActive({ textAlign: 'left' })}
           onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
         >
           <AlignLeft className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive({ textAlign: 'center' })}
           onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
         >
           <AlignCenter className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive({ textAlign: 'right' })}
           onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
         >
           <AlignRight className="h-4 w-4" />
         </Toggle>
         <Toggle
           size="sm"
           pressed={editor.isActive({ textAlign: 'justify' })}
           onPressedChange={() => editor.chain().focus().setTextAlign('justify').run()}
         >
           <AlignJustify className="h-4 w-4" />
         </Toggle>
 
         <Separator orientation="vertical" className="mx-1 h-6" />
 
         {/* Link */}
         <Popover open={isLinkPopoverOpen} onOpenChange={setIsLinkPopoverOpen}>
           <PopoverTrigger asChild>
             <Toggle
               size="sm"
               pressed={editor.isActive('link')}
             >
               <LinkIcon className="h-4 w-4" />
             </Toggle>
           </PopoverTrigger>
           <PopoverContent className="w-80">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-medium">URL liên kết</label>
               <div className="flex gap-2">
                 <Input
                   placeholder="https://example.com"
                   value={linkUrl}
                   onChange={(e) => setLinkUrl(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && addLink()}
                 />
                 <Button size="sm" onClick={addLink}>
                   Thêm
                 </Button>
               </div>
             </div>
           </PopoverContent>
         </Popover>
         {editor.isActive('link') && (
           <Button
             variant="ghost"
             size="icon"
             className="h-8 w-8"
             onClick={removeLink}
           >
             <Unlink className="h-4 w-4" />
           </Button>
         )}
 
         {/* Image */}
         <Popover open={isImagePopoverOpen} onOpenChange={setIsImagePopoverOpen}>
           <PopoverTrigger asChild>
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <ImageIcon className="h-4 w-4" />
             </Button>
           </PopoverTrigger>
           <PopoverContent className="w-80">
             <div className="flex flex-col gap-3">
               <label className="text-sm font-medium">Thêm hình ảnh</label>
               <div className="flex gap-2">
                 <Input
                   placeholder="URL hình ảnh"
                   value={imageUrl}
                   onChange={(e) => setImageUrl(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && addImage()}
                 />
                 <Button size="sm" onClick={addImage}>
                   Thêm
                 </Button>
               </div>
               {onImageUpload && (
                 <>
                   <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                       <span className="w-full border-t" />
                     </div>
                     <div className="relative flex justify-center text-xs uppercase">
                       <span className="bg-popover px-2 text-muted-foreground">
                         hoặc
                       </span>
                     </div>
                   </div>
                   <Input
                     type="file"
                     accept="image/*"
                     onChange={handleImageUpload}
                   />
                 </>
               )}
             </div>
           </PopoverContent>
         </Popover>
 
         {/* Table */}
         <Popover>
           <PopoverTrigger asChild>
             <Button variant="ghost" size="icon" className="h-8 w-8">
               <TableIcon className="h-4 w-4" />
             </Button>
           </PopoverTrigger>
           <PopoverContent className="w-48">
             <div className="flex flex-col gap-2">
               <Button
                 variant="ghost"
                 size="sm"
                 className="justify-start"
                 onClick={insertTable}
               >
                 <Plus className="h-4 w-4 mr-2" />
                 Chèn bảng 3x3
               </Button>
               {editor.isActive('table') && (
                 <>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="justify-start"
                     onClick={() => editor.chain().focus().addColumnAfter().run()}
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Thêm cột
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="justify-start"
                     onClick={() => editor.chain().focus().addRowAfter().run()}
                   >
                     <Plus className="h-4 w-4 mr-2" />
                     Thêm hàng
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="justify-start"
                     onClick={() => editor.chain().focus().deleteColumn().run()}
                   >
                     <Minus className="h-4 w-4 mr-2" />
                     Xóa cột
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="justify-start"
                     onClick={() => editor.chain().focus().deleteRow().run()}
                   >
                     <Minus className="h-4 w-4 mr-2" />
                     Xóa hàng
                   </Button>
                   <Button
                     variant="ghost"
                     size="sm"
                     className="justify-start text-destructive"
                     onClick={() => editor.chain().focus().deleteTable().run()}
                   >
                     <Trash2 className="h-4 w-4 mr-2" />
                     Xóa bảng
                   </Button>
                 </>
               )}
             </div>
           </PopoverContent>
         </Popover>
       </div>
 
       {/* Editor Content */}
       <EditorContent editor={editor} />
     </div>
   );
 };
 
 export default RichTextEditor;
