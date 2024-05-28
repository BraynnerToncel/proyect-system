import { IElement } from '../element/element.interface';
import { IFeature } from '../feature/feature.interface';

export interface IInstall {
  installId: string;
  value: string;
  feature: IFeature;
  element: IElement;
}

export type ICreateInstall = Omit<
  IInstall,
  'installId' | 'feature' | 'element'
> &
  Partial<Pick<IInstall, 'installId'>> &
  Pick<IFeature, 'featureId'> &
  Pick<IElement, 'elementId'>;

export type IUpdateInstall = Partial<ICreateInstall>;
