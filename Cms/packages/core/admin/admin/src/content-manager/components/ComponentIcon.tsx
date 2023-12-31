import { Flex, Icon } from '@strapi/design-system';
import * as Icons from '@strapi/icons';

import type { Schema } from '@strapi/types';

interface ComponentIconProps {
  showBackground?: boolean;
  icon?: Schema.ContentTypeInfo['icon'];
}

const ComponentIcon = ({ showBackground = true, icon = 'cube' }: ComponentIconProps) => {
  return (
    <Flex
      alignItems="center"
      background={showBackground ? 'neutral200' : undefined}
      justifyContent="center"
      height={8}
      width={8}
      color="neutral600"
      borderRadius={showBackground ? '50%' : 0}
    >
      <Icon
        as={COMPONENT_ICONS[icon as keyof typeof COMPONENT_ICONS] || COMPONENT_ICONS.cube}
        height={5}
        width={5}
      />
    </Flex>
  );
};

const COMPONENT_ICONS = {
  alien: Icons.Alien,
  apps: Icons.Apps,
  archive: Icons.Archive,
  arrowDown: Icons.ArrowDown,
  arrowLeft: Icons.ArrowLeft,
  arrowRight: Icons.ArrowRight,
  arrowUp: Icons.ArrowUp,
  attachment: Icons.Attachment,
  bell: Icons.Bell,
  bold: Icons.Bold,
  book: Icons.Book,
  briefcase: Icons.Briefcase,
  brush: Icons.Brush,
  bulletList: Icons.BulletList,
  calendar: Icons.Calendar,
  car: Icons.Car,
  cast: Icons.Cast,
  chartBubble: Icons.ChartBubble,
  chartCircle: Icons.ChartCircle,
  chartPie: Icons.ChartPie,
  check: Icons.Check,
  clock: Icons.Clock,
  cloud: Icons.Cloud,
  code: Icons.Code,
  cog: Icons.Cog,
  collapse: Icons.Collapse,
  command: Icons.Command,
  connector: Icons.Connector,
  crop: Icons.Crop,
  crown: Icons.Crown,
  cube: Icons.Cube,
  cup: Icons.Cup,
  cursor: Icons.Cursor,
  dashboard: Icons.Dashboard,
  database: Icons.Database,
  discuss: Icons.Discuss,
  doctor: Icons.Doctor,
  earth: Icons.Earth,
  emotionHappy: Icons.EmotionHappy,
  emotionUnhappy: Icons.EmotionUnhappy,
  envelop: Icons.Envelop,
  exit: Icons.Exit,
  expand: Icons.Expand,
  eye: Icons.Eye,
  feather: Icons.Feather,
  file: Icons.File,
  fileError: Icons.FileError,
  filePdf: Icons.FilePdf,
  filter: Icons.Filter,
  folder: Icons.Folder,
  gate: Icons.Gate,
  gift: Icons.Gift,
  globe: Icons.Globe,
  grid: Icons.Grid,
  handHeart: Icons.HandHeart,
  hashtag: Icons.Hashtag,
  headphone: Icons.Headphone,
  heart: Icons.Heart,
  house: Icons.House,
  information: Icons.Information,
  italic: Icons.Italic,
  key: Icons.Key,
  landscape: Icons.Landscape,
  layer: Icons.Layer,
  layout: Icons.Layout,
  lightbulb: Icons.Lightbulb,
  link: Icons.Link,
  lock: Icons.Lock,
  magic: Icons.Magic,
  manyToMany: Icons.ManyToMany,
  manyToOne: Icons.ManyToOne,
  manyWays: Icons.ManyWays,
  medium: Icons.Medium,
  message: Icons.Message,
  microphone: Icons.Microphone,
  monitor: Icons.Monitor,
  moon: Icons.Moon,
  music: Icons.Music,
  oneToMany: Icons.OneToMany,
  oneToOne: Icons.OneToOne,
  oneWay: Icons.OneWay,
  paint: Icons.Paint,
  paintBrush: Icons.PaintBrush,
  paperPlane: Icons.PaperPlane,
  pencil: Icons.Pencil,
  phone: Icons.Phone,
  picture: Icons.Picture,
  pin: Icons.Pin,
  pinMap: Icons.PinMap,
  plane: Icons.Plane,
  play: Icons.Play,
  plus: Icons.Plus,
  priceTag: Icons.PriceTag,
  puzzle: Icons.Puzzle,
  question: Icons.Question,
  quote: Icons.Quote,
  refresh: Icons.Refresh,
  repeat: Icons.Repeat,
  restaurant: Icons.Restaurant,
  rocket: Icons.Rocket,
  rotate: Icons.Rotate,
  scissors: Icons.Scissors,
  search: Icons.Search,
  seed: Icons.Seed,
  server: Icons.Server,
  shield: Icons.Shield,
  shirt: Icons.Shirt,
  shoppingCart: Icons.ShoppingCart,
  slideshow: Icons.Slideshow,
  stack: Icons.Stack,
  star: Icons.Star,
  store: Icons.Store,
  strikeThrough: Icons.StrikeThrough,
  sun: Icons.Sun,
  television: Icons.Television,
  thumbDown: Icons.ThumbDown,
  thumbUp: Icons.ThumbUp,
  train: Icons.Train,
  twitter: Icons.Twitter,
  typhoon: Icons.Typhoon,
  underline: Icons.Underline,
  user: Icons.User,
  volumeMute: Icons.VolumeMute,
  volumeUp: Icons.VolumeUp,
  walk: Icons.Walk,
  wheelchair: Icons.Wheelchair,
  write: Icons.Write,
};

export { ComponentIcon };
export type { ComponentIconProps };
