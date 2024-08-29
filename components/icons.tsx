import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  X,
  Loader,
  Baseline,
  Bold,
  Italic,
  Underline,
  Type,
  PaintBucket,
  Image,
  Ellipsis,
  Highlighter,
  Ban,
  Plus,
  Link2,
  List,
  ListOrdered,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  TriangleRight,
  Strikethrough,
  ALargeSmall,
  AlignStartVertical,
  AlignEndHorizontal,
  AlignCenterVertical,
  AlignCenterHorizontal,
  AlignStartHorizontal,
  AlignEndVertical,
  MousePointer2,
  Hand,
  Wand,
  Play,
  Trash2,
  Copy,
  Check,
  LifeBuoy,
  Upload,
  Lightbulb,
  ListTodo,
  File,
  FileText,
  ImageUp,
  FileVideo,
  FileAudio,
  FolderDown,
  LucideProps,
} from "lucide-react";

export const Icons = {
  drive: FolderDown,
  audio: FileAudio,
  vid: FileVideo,
  img: ImageUp,
  pdf: FileText,
  todo: ListTodo,
  lightbulb: Lightbulb,
  upload: Upload,
  lifeBuoy: LifeBuoy,
  check: Check,
  copy: Copy,
  trash: Trash2,
  play: Play,
  wand: Wand,
  hand: Hand,
  cursor: MousePointer2,
  text: Type,
  alignEndVertical: AlignEndVertical,
  alignStartHorizontal: AlignStartHorizontal,
  alignCenterHorizontal: AlignCenterHorizontal,
  alignEndHorizontal: AlignEndHorizontal,
  alignStartVertical: AlignStartVertical,
  alignCenterVertical: AlignCenterVertical,
  textSize: ALargeSmall,
  strike: Strikethrough,
  triangleRight: TriangleRight,
  alignCenter: AlignCenter,
  alignLeft: AlignLeft,
  alignRight: AlignRight,
  alignJustify: AlignJustify,
  orderedList: ListOrdered,
  bulletList: List,
  link: Link2,
  add: Plus,
  Ban: Ban,
  highlighter: Highlighter,
  ellipsis: Ellipsis,
  image: Image,
  paintBucket: PaintBucket,
  type: Type,
  underline: Underline,
  Italic: Italic,
  bold: Bold,
  textColor: Baseline,
  close: X,
  spinner: Loader2,
  loader: Loader,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  file: File,
  googleDrive: (props: LucideProps) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78">
      <path
        fill="#0066da"
        d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L27.5 53H0c0 1.55.4 3.1 1.2 4.5z"
      ></path>
      <path
        fill="#00ac47"
        d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 000 53h27.5z"
      ></path>
      <path
        fill="#ea4335"
        d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.798l5.852 11.5z"
      ></path>
      <path
        fill="#00832d"
        d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z"
      ></path>
      <path
        fill="#2684fc"
        d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
      ></path>
      <path
        fill="#ffba00"
        d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z"
      ></path>
    </svg>
  ),
};
