import { IElement } from '../element/element.interface';
import { IFeature } from '../feature/feature.interface';

export interface IType {
  typeId: string;
  typeName: string;
  typeDescription: string;
  typeState: boolean;
  element: IElement;
  feature: Array<IFeature>;
}

export type ICreateType = Omit<
  IType,
  'typeId' | 'element' | 'feature' | 'typeState' | 'element'
> &
  Partial<Pick<IType, 'typeId'>> &
  // Pick<IElement, 'elementId'> &
  Record<'feature', Array<Pick<IFeature, 'featureId'>>>;

export type IUpdateFeature = Partial<ICreateType>;
