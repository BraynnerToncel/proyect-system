import { IInstall } from '../install/install.interface';
import { IType } from '../type/type.interface';

export interface IFeature {
  featureId: string;
  featureName: string;
  featureState: boolean;
  featureRequired: boolean;
  featureUserName: string;
  type: Array<IType>;
  install: IInstall;
}

export type ICreateFeature = Omit<
  IFeature,
  'featureId' | 'type' | 'install' | 'featureState'
> &
  Partial<Pick<IFeature, 'featureState'>> &
  Pick<IInstall, 'installId'> &
  Record<'type', Array<Pick<IType, 'typeId'>>>;

export type IUpdateFeature = Partial<ICreateFeature>;
