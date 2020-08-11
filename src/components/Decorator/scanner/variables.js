import {
  RotateLeft as RotateLeftIcon,
  RotateRight as RotateRightIcon,
  Flip as FlipIcon,
  Crop as CropIcon,
  SaveAlt,
  PanTool as Select,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  AspectRatio as AspectRatioIcon,
} from '@material-ui/icons'
import { Tools } from '@/components'

export const ToolTypes = {
  ZoomIn: 2,
  ZoomOut: 3,
  RotateLeft: 4,
  RotateRight: 5,
  Mirror: 6,
  Crop: 7,
  Download: 8,
  Full: 9,
  Fit: 10,
  Resize: 11,
}

export const leftTools = ({ currentTool }) => {
  return [
    {
      id: ToolTypes.ZoomIn,
      title: 'Zoom In',
      icon: <ZoomInIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.ZoomOut,
      title: 'Zoom Out',
      icon: <ZoomOutIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.Full,
      title: '1:1',
      icon: <FullscreenIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.Fit,
      title: 'Fit On Screen',
      icon: <FullscreenExitIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.RotateLeft,
      title: 'Rotate Left 90',
      icon: <RotateLeftIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.RotateRight,
      title: 'Rotate Right 90',
      icon: <RotateRightIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.Mirror,
      title: 'Mirror',
      icon: <FlipIcon style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.Crop,
      title: 'Crop',
      icon: (
        <CropIcon
          color='primary'
          style={{ color: currentTool === Tools.Crop ? '' : '#191919' }}
        />
      ),
    },
    {
      id: ToolTypes.Resize,
      title: 'Resize',
      icon: <AspectRatioIcon color='primary' style={{ color: '#191919' }} />,
    },
    {
      id: ToolTypes.Download,
      title: 'Download with original size',
      icon: <SaveAlt style={{ color: '#191919' }} />,
    },
  ]
}
