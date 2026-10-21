import type { ImageAsset } from '../types/catalog';

interface EditedImageVariant {
  src: string;
  width: number;
  height: number;
}

interface EditedImage {
  src: string;
  large: string;
  width: number;
  height: number;
  variants: EditedImageVariant[];
}

function createEditedImage(name: string, previewHeight: number, height: number): EditedImage {
  const src = `images/edited/${name}-480.jpg`;
  const large = `images/edited/${name}-960.jpg`;
  return {
    src,
    large,
    width: 960,
    height,
    variants: [
      { src, width: 480, height: previewHeight },
      { src: large, width: 960, height },
    ],
  };
}

export const editedImages: Record<string, EditedImage | undefined> = {
  'images/vidu_kamnya/1_4_1.jpg': createEditedImage('category-1', 396, 793),
  'images/vidu_kamnya/2_1_1.jpg': createEditedImage('category-2', 360, 720),
  'images/vidu_kamnya/12_1.jpg': createEditedImage('category-4', 359, 719),
  'images/vidu_kamnya/11_2.jpg': createEditedImage('category-5', 359, 719),
  'images/vidu_kamnya/5_1.jpg': createEditedImage('category-6', 359, 719),
  'images/obcekt/1_1.jpg': createEditedImage('project-1', 359, 719),
  'images/obcekt/1_2.jpg': createEditedImage('project-2', 360, 720),
  'images/obcekt/1_3.jpg': createEditedImage('project-3', 359, 719),
  'images/obcekt/1_4.jpg': createEditedImage('project-4', 359, 719),
  'images/obcekt/1_5.jpg': createEditedImage('project-5', 359, 719),
  'images/obcekt/1_6.jpg': createEditedImage('project-6', 359, 719),
  'images/obcekt/1_7.jpg': createEditedImage('project-7', 359, 719),
  'images/obcekt/1_8.jpg': createEditedImage('project-8', 360, 720),
  'images/obcekt/1_9.jpg': createEditedImage('project-9', 360, 720),
  'images/obcekt/1_10.jpg': createEditedImage('project-10', 359, 719),
  'images/obcekt/1_12.jpg': createEditedImage('project-12', 354, 709),
  'images/obcekt/1_13.jpg': createEditedImage('project-13', 354, 709),
  'images/obcekt/1_14.jpg': createEditedImage('project-14', 354, 709),
  'images/vidu_kamnya/6_1.jpg': createEditedImage('warehouse-1', 344, 689),
  'images/vidu_kamnya/6_2.jpg': createEditedImage('warehouse-2', 344, 689),
  'images/vidu_kamnya/6_3.jpg': createEditedImage('warehouse-3', 344, 689),
  'images/vidu_kamnya/10_1.jpg': createEditedImage('warehouse-5', 359, 719),
  'images/vidu_kamnya/10_2.jpg': createEditedImage('warehouse-6', 359, 719),
  'images/vidu_kamnya/3_1_1.jpg': createEditedImage('category-3', 344, 689),
  'images/obcekt/1_11.jpg': createEditedImage('project-11', 354, 709),
  'images/vidu_kamnya/6_4.jpg': createEditedImage('warehouse-4', 344, 689),
};

export const editedImageDimensions: Record<string, { width: number; height: number }> =
  Object.fromEntries(
    Object.values(editedImages).flatMap((image) =>
      image
        ? image.variants.map((variant) => [
            variant.src,
            {
              width: variant.width,
              height: variant.height,
            },
          ])
        : [],
    ),
  );

export function withEditedImage(image: ImageAsset): ImageAsset {
  const edited = editedImages[image.src];
  return edited ? { ...image, ...edited } : image;
}
