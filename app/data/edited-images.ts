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
  'images/new_cam/1_1.jpg': createEditedImage('catalog-20', 360, 720),
  'images/vidu_kamnya/7_1_1.jpg': createEditedImage('catalog-21', 359, 719),
  'images/new_cam/1_2.jpg': createEditedImage('catalog-22', 360, 720),
  'images/vidu_kamnya/7_2_1.jpg': createEditedImage('catalog-23', 359, 719),
  'images/new_cam/1_3.jpg': createEditedImage('catalog-24', 357, 714),
  'images/vidu_kamnya/1_2_1.jpg': createEditedImage('catalog-25', 396, 793),
  'images/vidu_kamnya/1_6_1.jpg': createEditedImage('catalog-26', 396, 793),
  'images/vidu_kamnya/7_3_1.jpg': createEditedImage('catalog-27', 359, 718),
  'images/new_cam/1_4.jpg': createEditedImage('catalog-28', 360, 720),
  'images/vidu_kamnya/1_3_1.jpg': createEditedImage('catalog-29', 396, 793),
  'images/new_cam/1/1_1.jpg': createEditedImage('catalog-49', 360, 720),
  'images/vidu_kamnya/5_2.jpg': createEditedImage('catalog-104', 320, 640),
  'images/new_cam/1_5.jpg': createEditedImage('catalog-30', 535, 1070),
  'images/new_cam/1_6.jpg': createEditedImage('catalog-31', 369, 738),
  'images/new_cam/1_7.jpg': createEditedImage('catalog-32', 455, 911),
  'images/new_cam/1_8.jpg': createEditedImage('catalog-33', 360, 720),
  'images/vidu_kamnya/1_1_1.jpg': createEditedImage('catalog-34', 444, 889),
  'images/new_cam/1_9.jpg': createEditedImage('catalog-35', 480, 960),
  'images/new_cam/1_10.jpg': createEditedImage('catalog-36', 360, 720),
  'images/vidu_kamnya/1_5_1.jpg': createEditedImage('catalog-37', 396, 793),
  'images/vidu_kamnya/7_4_1.jpg': createEditedImage('catalog-38', 359, 719),
  'images/new_cam/1_11.jpg': createEditedImage('catalog-39', 360, 720),
  'images/new_cam/1_12.jpg': createEditedImage('catalog-40', 360, 720),
  'images/new_cam/1_13.jpg': createEditedImage('catalog-41', 360, 720),
  'images/new_cam/1_14.jpg': createEditedImage('catalog-42', 360, 720),
  'images/vidu_kamnya/2_2_1.jpg': createEditedImage('catalog-44', 344, 689),
  'images/vidu_kamnya/8_1.jpg': createEditedImage('catalog-45', 359, 719),
  'images/vidu_kamnya/8_2.jpg': createEditedImage('catalog-46', 360, 720),
  'images/vidu_kamnya/8_3.jpg': createEditedImage('catalog-47', 359, 719),
  'images/vidu_kamnya/8_4.jpg': createEditedImage('catalog-48', 359, 719),
  'images/new_cam/1/1_11.jpg': createEditedImage('catalog-50', 360, 720),
  'images/new_cam/1/1_3.jpg': createEditedImage('catalog-51', 360, 720),
  'images/new_cam/1/1_4.jpg': createEditedImage('catalog-52', 360, 720),
  'images/new_cam/1/1_5.jpg': createEditedImage('catalog-53', 360, 720),
  'images/new_cam/1/1_6.jpg': createEditedImage('catalog-54', 360, 720),
  'images/new_cam/1/1_7.jpg': createEditedImage('catalog-55', 360, 720),
  'images/new_cam/1/1_8.jpg': createEditedImage('catalog-56', 381, 763),
  'images/new_cam/1/1_9.jpg': createEditedImage('catalog-57', 360, 720),
  'images/new_cam/1/1_10.jpg': createEditedImage('catalog-58', 360, 720),
  'images/new_cam/1/1_2.jpg': createEditedImage('catalog-59', 360, 720),
  'images/vidu_kamnya/3_2_1.jpg': createEditedImage('catalog-62', 359, 719),
  'images/vidu_kamnya/9_1.jpg': createEditedImage('catalog-63', 359, 719),
  'images/new_cam/2/1_1.jpg': createEditedImage('catalog-64', 360, 720),
  'images/new_cam/2/1_2.jpg': createEditedImage('catalog-65', 360, 720),
  'images/new_cam/2/1_3.jpg': createEditedImage('catalog-66', 360, 720),
  'images/new_cam/2/1_4.jpg': createEditedImage('catalog-67', 360, 720),
  'images/new_cam/2/1_5.jpg': createEditedImage('catalog-68', 360, 720),
  'images/new_cam/2/1_6.jpg': createEditedImage('catalog-69', 360, 720),
  'images/new_cam/2/1_7.jpg': createEditedImage('catalog-70', 421, 842),
  'images/new_cam/2/1_8.jpg': createEditedImage('catalog-71', 360, 720),
  'images/new_cam/2/1_9.jpg': createEditedImage('catalog-72', 360, 720),
  'images/vidu_kamnya/12_2.jpg': createEditedImage('catalog-74', 359, 719),
  'images/vidu_kamnya/12_3.jpg': createEditedImage('catalog-75', 359, 719),
  'images/vidu_kamnya/12_4.jpg': createEditedImage('catalog-76', 359, 719),
  'images/vidu_kamnya/12_5.jpg': createEditedImage('catalog-77', 359, 719),
  'images/vidu_kamnya/12_6.jpg': createEditedImage('catalog-78', 359, 719),
  'images/vidu_kamnya/12_7.jpg': createEditedImage('catalog-79', 359, 719),
  'images/vidu_kamnya/12_8.jpg': createEditedImage('catalog-80', 359, 719),
  'images/vidu_kamnya/12_9.jpg': createEditedImage('catalog-81', 359, 719),
  'images/vidu_kamnya/12_10.jpg': createEditedImage('catalog-82', 359, 719),
  'images/vidu_kamnya/1_9.jpg': createEditedImage('catalog-83', 344, 689),
  'images/vidu_kamnya/4_8.jpg': createEditedImage('catalog-84', 344, 689),
  'images/new_cam/3/1_1.jpg': createEditedImage('catalog-85', 360, 720),
  'images/new_cam/3/1_2.jpg': createEditedImage('catalog-86', 360, 720),
  'images/new_cam/3/1_3.jpg': createEditedImage('catalog-87', 360, 720),
  'images/new_cam/3/1_4.jpg': createEditedImage('catalog-88', 360, 720),
  'images/new_cam/3/1_5.jpg': createEditedImage('catalog-89', 336, 673),
  'images/new_cam/3/1_6.jpg': createEditedImage('catalog-90', 360, 720),
  'images/vidu_kamnya/4_2.jpg': createEditedImage('catalog-92', 359, 719),
  'images/new_cam/1/1_12.jpg': createEditedImage('catalog-60', 360, 720),
  'images/vidu_kamnya/4_3.jpg': createEditedImage('catalog-93', 359, 719),
  'images/vidu_kamnya/4_4.jpg': createEditedImage('catalog-94', 359, 719),
  'images/vidu_kamnya/4_5.jpg': createEditedImage('catalog-95', 359, 719),
  'images/vidu_kamnya/4_6.jpg': createEditedImage('catalog-96', 359, 719),
  'images/vidu_kamnya/4_7.jpg': createEditedImage('catalog-97', 359, 719),
  'images/vidu_kamnya/4_1.jpg': createEditedImage('catalog-98', 359, 719),
  'images/vidu_kamnya/4_9.jpg': createEditedImage('catalog-99', 344, 689),
  'images/vidu_kamnya/4_10.jpg': createEditedImage('catalog-100', 344, 688),
  'images/vidu_kamnya/4_11.jpg': createEditedImage('catalog-101', 344, 689),
  'images/vidu_kamnya/11_1.jpg': createEditedImage('catalog-102', 359, 719),
  'images/vidu_kamnya/5_3.jpg': createEditedImage('catalog-105', 320, 640),
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
