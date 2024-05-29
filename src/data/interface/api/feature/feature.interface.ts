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
  'featureId' | 'type' | 'install' | 'featureState' | 'featureState'
> & {
  featureName: string;
  featureUserName: string;
};

export type IUpdateFeature = Partial<ICreateFeature>;
