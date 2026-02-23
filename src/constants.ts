import { 
  FileImage, 
  FileText, 
  Music, 
  Video, 
  Archive, 
  Book, 
  Smartphone, 
  Cpu, 
  Globe, 
  ArrowRightLeft,
  Hash,
  FileCode
} from 'lucide-react';

export type CategoryType = 'image' | 'document' | 'audio' | 'video' | 'archive' | 'ebook' | 'device' | 'software' | 'web' | 'other';

export interface ConverterCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  formats: string[];
}

export const CATEGORIES: ConverterCategory[] = [
  {
    id: 'audio',
    name: 'Conversor de áudio',
    description: 'Um conversor de áudio online versátil para converter arquivos de áudio para formatos mais comuns.',
    icon: Music,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    formats: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A', 'WMA', 'AIFF']
  },
  {
    id: 'document',
    name: 'Conversor de documentos',
    description: 'Nossa seleção de conversores gratuitos de documentos que permite converter Word para PDF, JPG para PDF e muito mais.',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    formats: ['PDF', 'DOCX', 'DOC', 'XLSX', 'PPTX', 'TXT', 'RTF', 'ODT']
  },
  {
    id: 'web',
    name: 'Conversor de serviço web',
    description: 'Converta e otimize seus arquivos para serviços da web como WhatsApp, Twitter, Facebook e muito mais.',
    icon: Globe,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    formats: ['WhatsApp', 'Twitter', 'Facebook', 'Instagram', 'YouTube']
  },
  {
    id: 'software',
    name: 'Conversor de softwares',
    description: 'Converta seus arquivos de PDF para Word, PDF para Excel e muito mais.',
    icon: Cpu,
    color: 'text-zinc-600',
    bgColor: 'bg-zinc-100',
    formats: ['Word', 'Excel', 'PowerPoint', 'AutoCAD']
  },
  {
    id: 'video',
    name: 'Conversor de vídeo',
    description: 'Converta arquivos de vídeo nos formatos mais comuns, como MP4, AVI, MOV e mais.',
    icon: Video,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    formats: ['MP4', 'MOV', 'AVI', 'MKV', 'WEBM', 'WMV', 'FLV', '3GP']
  },
  {
    id: 'ebook',
    name: 'Conversor de ebook',
    description: 'Uma lista versátil de conversores de ebook online que pode converter seus documentos de texto para ebook facilmente.',
    icon: Book,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    formats: ['EPUB', 'MOBI', 'AZW3', 'FB2', 'PDF', 'LIT']
  },
  {
    id: 'device',
    name: 'Conversor de dispositivos',
    description: 'Uma coleção de conversores de vídeo online para seu dispositivo móvel, vídeo-game ou tablet.',
    icon: Smartphone,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    formats: ['iPhone', 'Android', 'iPad', 'PlayStation', 'Xbox']
  },
  {
    id: 'other',
    name: 'Gerador de hash',
    description: 'Gere um hash ou soma de verificação com essas ferramentas geradoras de hash.',
    icon: Hash,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    formats: ['MD5', 'SHA1', 'SHA256', 'SHA512', 'CRC32']
  },
  {
    id: 'image',
    name: 'Conversor de imagem',
    description: 'Aqui você pode encontrar um conversor de imagens para suas necessidades, por exemplo, um conversor de PDF para imagem.',
    icon: FileImage,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    formats: ['JPG', 'PNG', 'WebP', 'SVG', 'GIF', 'TIFF', 'ICO', 'BMP']
  },
  {
    id: 'archive',
    name: 'Conversor de arquivo',
    description: 'Crie arquivos compactados como um ZIP com esta ferramenta de compactação gratuita.',
    icon: Archive,
    color: 'text-brown-600',
    bgColor: 'bg-stone-100',
    formats: ['ZIP', 'RAR', '7Z', 'TAR', 'GZ', 'BZ2']
  }
];

export const FORMAT_MAPPING: Record<string, string[]> = {
  'pdf': ['DOCX', 'DOC', 'XLSX', 'PPTX', 'TXT', 'JPG', 'PNG', 'EPUB'],
  'docx': ['PDF', 'DOC', 'TXT', 'ODT', 'HTML'],
  'doc': ['PDF', 'DOCX', 'TXT', 'ODT'],
  'xlsx': ['PDF', 'CSV', 'TXT', 'ODS'],
  'pptx': ['PDF', 'PPT', 'JPG', 'PNG'],
  'jpg': ['PNG', 'WebP', 'PDF', 'SVG', 'GIF', 'TIFF', 'ICO'],
  'jpeg': ['PNG', 'WebP', 'PDF', 'SVG', 'GIF', 'TIFF', 'ICO'],
  'png': ['JPG', 'WebP', 'PDF', 'SVG', 'GIF', 'TIFF', 'ICO'],
  'webp': ['JPG', 'PNG', 'PDF', 'GIF'],
  'mp3': ['WAV', 'FLAC', 'AAC', 'OGG', 'M4A'],
  'wav': ['MP3', 'FLAC', 'AAC', 'OGG'],
  'mp4': ['MOV', 'AVI', 'MKV', 'WEBM', 'WMV', 'MP3'],
  'mov': ['MP4', 'AVI', 'MKV', 'WEBM'],
  'zip': ['RAR', '7Z', 'TAR'],
  'rar': ['ZIP', '7Z', 'TAR'],
};

export const ALL_FORMATS = Array.from(new Set([
  ...Object.keys(FORMAT_MAPPING),
  ...Object.values(FORMAT_MAPPING).flat()
])).map(f => f.toUpperCase()).sort();
