export type RegistrySort = 'relevance' | 'popular' | 'recent' | 'newest' | 'name';
export type RegistryStatus = 'indexed' | 'manifest-valid' | 'runtime-verified';
export type RepositoryAvailability = 'active' | 'archived' | 'unavailable';
export type SecuritySeverity = 'info' | 'low' | 'medium' | 'high' | 'critical';
export type CompatibilityStatus = 'passed' | 'failed' | 'partial' | 'untested';
export interface CatalogResponse { apiVersion:'1'; generatedAt:string; registry:{name:string;url:string;pluginCount:number}; categories:Array<{slug:string;label:string;count:number}>; pluginTypes:Array<{slug:string;count:number}> }
export interface PluginListItem { slug:string; name:string; repository:string; repositoryUrl:string; description:{en:string;zh?:string}; artifactType:string; pluginType?:string; categories:string[]; stars?:number; registryStatus:RegistryStatus; repositoryAvailability:RepositoryAvailability; installCommand?:string; profile?:string; version?:string; license?:string; activityAt?:string; security:{signalCount:number;highestSeverity?:SecuritySeverity}; compatibility:{hasEvidence:boolean;latestStatus?:CompatibilityStatus;dshVersion?:string;testedAt?:string}; detailUrl:string }
export interface PluginListResponse { apiVersion:'1'; items:PluginListItem[]; total:number; page:{nextCursor?:string;hasMore:boolean} }
export type Translate = (key:string)=>string;
