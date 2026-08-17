export const styles = `
.dshr-root{
  --dshr-brand:#168f44;
  --dshr-brand-hover:#0f7838;
  --dshr-brand-soft:color-mix(in srgb,var(--dshr-brand) 9%,transparent);
  --dshr-brand-soft-strong:color-mix(in srgb,var(--dshr-brand) 14%,transparent);
  --dshr-warn:#b7791f;
  --dsw-alias-brand-primary:var(--dshr-brand);
  --dsw-alias-state-business-primary:var(--dshr-brand);
  --dsw-alias-button-primary-fill:var(--dshr-brand);
  --dsw-alias-button-primary-hover:var(--dshr-brand-hover);
  --dsw-alias-button-ghost-active-fill:var(--dshr-brand-soft-strong);
  --dsw-alias-button-ghost-active-border:color-mix(in srgb,var(--dshr-brand) 32%,transparent);
  height:100%;display:flex;flex-direction:column;min-width:0;
  color:var(--dsw-alias-label-primary,#171b18)
}
.dshr-head{display:flex;flex-direction:column;gap:16px;padding:8px 8px 18px}
.dshr-title-row{display:block}
.dshr-title-copy{min-width:0;max-width:760px}
.dshr-title-line{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dshr-title{margin:0;font-size:20px;line-height:28px;font-weight:680;letter-spacing:-.015em}
.dshr-count-badge{display:inline-flex;align-items:center;min-height:24px;padding:1px 10px;border:1px solid color-mix(in srgb,var(--dshr-brand) 22%,var(--dsw-alias-border-l2,#dde3df));border-radius:999px;background:var(--dshr-brand-soft);color:var(--dshr-brand);font-size:11px;line-height:18px;font-weight:600;white-space:nowrap}
.dshr-sub{margin:5px 0 0;max-width:680px;color:var(--dsw-alias-label-tertiary,#7a837d);font-size:13px;line-height:20px}
.dshr-toolbar{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px}
.dshr-search-shell{position:relative;min-width:0}
.dshr-search{box-sizing:border-box;width:100%;height:40px!important;padding:0 40px 0 12px!important;border-radius:10px!important;background:var(--dsw-alias-bg-layer-1,#fff)!important}
.dshr-search:focus-within{box-shadow:0 0 0 2px color-mix(in srgb,var(--dshr-brand) 13%,transparent)}
.dshr-search-spinner{position:absolute;right:13px;top:50%;width:14px;height:14px;margin-top:-7px;border:2px solid color-mix(in srgb,var(--dshr-brand) 20%,transparent);border-top-color:var(--dshr-brand);border-radius:50%;animation:dshr-spin .72s linear infinite;pointer-events:none}
.dshr-sort-button{min-width:156px!important;height:40px!important;border-radius:10px!important;justify-content:space-between!important;padding:0 13px!important;font-size:12px!important}
.dshr-filter-shell{position:relative;min-width:0;padding-top:1px}
.dshr-filter-row{display:flex;align-items:center;gap:8px;min-width:0;overflow-x:auto;overflow-y:hidden;padding:1px 34px 2px 0;scrollbar-width:none;overscroll-behavior-x:contain;scroll-snap-type:x proximity}
.dshr-filter-row::-webkit-scrollbar{display:none}
.dshr-filter-row>.dshr-filter-pill{flex:none;scroll-snap-align:start}
.dshr-filter-fade{position:absolute;top:0;bottom:0;z-index:2;width:50px;pointer-events:none}
.dshr-filter-fade-left{left:0;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-1,#fff) 24%,color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 88%,transparent) 58%,transparent)}
.dshr-filter-fade-right{right:0;background:linear-gradient(270deg,var(--dsw-alias-bg-layer-1,#fff) 24%,color-mix(in srgb,var(--dsw-alias-bg-layer-1,#fff) 88%,transparent) 58%,transparent)}
.dshr-filter-arrow{position:absolute;top:50%;z-index:3;display:flex;align-items:center;justify-content:center;width:26px;height:26px;margin-top:-13px;border:1px solid var(--dsw-alias-border-l2,#dce2de);border-radius:999px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#667069);box-shadow:0 2px 8px color-mix(in srgb,#152019 8%,transparent);cursor:pointer;transition:color .15s ease,border-color .15s ease,background .15s ease}
.dshr-filter-arrow:hover{color:var(--dshr-brand);border-color:color-mix(in srgb,var(--dshr-brand) 34%,var(--dsw-alias-border-l2,#dce2de));background:var(--dshr-brand-soft)}
.dshr-filter-arrow svg{transition:transform .15s ease}
.dshr-filter-arrow-left{left:4px}
.dshr-filter-arrow-left svg{transform:rotate(90deg)}
.dshr-filter-arrow-right{right:4px}
.dshr-filter-arrow-right svg{transform:rotate(-90deg)}
.dshr-filter-pill{height:30px!important;padding:0 12px!important;border-radius:8px!important;background:var(--dsw-alias-bg-layer-1,#fff)!important;box-shadow:inset 0 0 0 1px var(--dsw-alias-border-l2,#dce2de)!important;font-size:11px!important}
.dshr-filter-pill:hover{color:var(--dshr-brand)!important;background:var(--dshr-brand-soft)!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dshr-brand) 25%,var(--dsw-alias-border-l2,#dce2de))!important}
.dshr-filter-pill[data-selected='true']{color:var(--dshr-brand)!important;background:var(--dshr-brand-soft-strong)!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dshr-brand) 40%,transparent)!important;font-weight:600}
.dshr-body{position:relative;flex:1;overflow-y:auto;overflow-x:hidden;padding:10px 8px 30px;border-top:1px solid color-mix(in srgb,var(--dsw-alias-border-l2,#e3e7e4) 78%,transparent)}
.dshr-progress{position:sticky;top:0;z-index:3;height:2px;margin:-10px 0 10px;overflow:hidden;background:transparent}
.dshr-progress::after{content:"";display:block;width:36%;height:100%;border-radius:999px;background:var(--dshr-brand);animation:dshr-progress 1s ease-in-out infinite}
.dshr-list{display:flex;flex-direction:column;gap:14px;transition:opacity .15s ease,filter .15s ease}
.dshr-list-refreshing{opacity:.6;filter:saturate(.92);pointer-events:none}
.dshr-card{display:flex;flex-direction:column;gap:14px;padding:17px 18px 14px;border:1px solid var(--dsw-alias-border-l2,#e0e5e1);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);box-shadow:0 2px 8px color-mix(in srgb,#152019 4%,transparent);transition:border-color .15s ease,box-shadow .15s ease,transform .15s ease}
.dshr-card:hover{border-color:color-mix(in srgb,var(--dshr-brand) 18%,var(--dsw-alias-border-l2,#dfe5e0));box-shadow:0 5px 16px color-mix(in srgb,#152019 6%,transparent)}
.dshr-card-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;min-width:0}
.dshr-card-identity{display:flex;align-items:center;gap:12px;min-width:0}
.dshr-plugin-glyph{display:inline-flex;flex:none;align-items:center;justify-content:center;width:42px;height:42px;border:1px solid color-mix(in srgb,var(--dshr-brand) 15%,var(--dsw-alias-border-l2,#dfe5e1));border-radius:10px;background:linear-gradient(145deg,color-mix(in srgb,var(--dshr-brand) 9%,var(--dsw-alias-bg-layer-1,#fff)),color-mix(in srgb,var(--dshr-brand) 3%,var(--dsw-alias-bg-layer-1,#fff)));color:var(--dshr-brand)}
.dshr-card-title-copy{min-width:0}
.dshr-name-row{display:flex;align-items:baseline;gap:10px;min-width:0}
.dshr-name{margin:0;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:15px;line-height:22px;font-weight:680;letter-spacing:-.005em}
.dshr-repo{margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary,#7a837d);font:11px/17px ui-monospace,SFMono-Regular,Menlo,monospace}
.dshr-stars{flex:none;color:var(--dsw-alias-label-secondary,#69726c);font-size:11px;line-height:17px;font-weight:500}
.dshr-status{display:inline-flex;flex:none;align-items:center;gap:5px;min-height:24px;padding:1px 9px;border-radius:7px;font-size:10px;line-height:17px;font-weight:600;white-space:nowrap}
.dshr-status[data-tone='success']{background:var(--dshr-brand-soft);color:var(--dshr-brand)}
.dshr-status[data-tone='warning']{background:color-mix(in srgb,var(--dshr-warn) 10%,transparent);color:var(--dshr-warn)}
.dshr-status-dot{width:6px;height:6px;border-radius:999px;background:currentColor}
.dshr-desc{margin:0;color:var(--dsw-alias-label-secondary,#5f6962);font-size:12px;line-height:19px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dshr-evidence-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dshr-evidence-card{display:flex;align-items:center;gap:10px;min-width:0;padding:11px 12px;border:1px solid color-mix(in srgb,var(--dsw-alias-border-l2,#e0e5e1) 90%,transparent);border-radius:9px;background:var(--dsw-alias-bg-layer-2,#f7f9f7)}
.dshr-evidence-icon{display:inline-flex;flex:none;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#67716a)}
.dshr-evidence-card[data-tone='success'] .dshr-evidence-icon{background:var(--dshr-brand-soft);color:var(--dshr-brand)}
.dshr-evidence-card[data-tone='warning'] .dshr-evidence-icon{background:color-mix(in srgb,var(--dshr-warn) 10%,transparent);color:var(--dshr-warn)}
.dshr-evidence-card[data-tone='partial'] .dshr-evidence-icon{background:color-mix(in srgb,#c58a19 9%,transparent);color:#a56f0b}
.dshr-evidence-copy{min-width:0}
.dshr-evidence-label{display:block;margin-bottom:1px;color:var(--dsw-alias-label-tertiary,#7a837d);font-size:10px;line-height:16px}
.dshr-evidence-value{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#1d221f);font-size:11px;line-height:18px;font-weight:600}
.dshr-command{display:flex;align-items:center;gap:10px;min-width:0;padding:7px 7px 7px 11px;border:1px solid color-mix(in srgb,var(--dsw-alias-border-l2,#e0e5e1) 80%,transparent);border-radius:9px;background:var(--dsw-alias-bg-module-platform,var(--dsw-alias-bg-layer-2,#f7f9f7))}
.dshr-command code{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#1d221f);font:11px/18px ui-monospace,SFMono-Regular,Menlo,monospace}
.dshr-command-empty{color:var(--dsw-alias-label-tertiary,#7a837d);font-size:11px;line-height:18px}
.dshr-card-footer{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:28px}
.dshr-card-tags{display:flex;align-items:center;gap:6px;min-width:0;flex-wrap:wrap}
.dshr-card-tag{height:24px!important;border-radius:6px!important;background:var(--dsw-alias-bg-layer-2,#f3f6f4)!important;color:var(--dsw-alias-label-secondary,#667069)!important;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--dsw-alias-border-l2,#dfe5e1) 78%,transparent)!important}
.dshr-details{display:inline-flex;flex:none;align-items:center;gap:6px;padding:5px 3px 5px 8px;border-radius:7px;color:var(--dshr-brand);font-size:11px;line-height:18px;font-weight:650;text-decoration:none;white-space:nowrap}
.dshr-details:hover{background:var(--dshr-brand-soft)}
.dshr-details-arrow{font-size:14px;transition:transform .15s ease}
.dshr-details:hover .dshr-details-arrow{transform:translateX(2px)}
.dshr-state{display:flex;flex-direction:column;align-items:center;text-align:center;padding:54px 18px;color:var(--dsw-alias-label-secondary,#69726c);font-size:12px;line-height:19px}
.dshr-state strong{margin-bottom:4px;color:var(--dsw-alias-label-primary,#1d221f);font-size:13px}
.dshr-state-actions{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:14px}
.dshr-state-link{color:var(--dshr-brand);font-size:11px;font-weight:600;text-decoration:none}
.dshr-state-link:hover{text-decoration:underline}
.dshr-load{display:flex;justify-content:center;padding:22px 0 6px}
.dshr-load-error{display:flex;align-items:center;justify-content:center;gap:10px;padding-top:14px;color:var(--dsw-alias-label-tertiary,#7a837d);font-size:11px}
.dshr-footer{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:18px;padding:14px 14px;border-top:1px solid color-mix(in srgb,var(--dsw-alias-border-l2,#e0e5e1) 72%,transparent);border-radius:10px;background:color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f5f7f5) 72%,transparent);color:var(--dsw-alias-label-tertiary,#7a837d);font-size:11px;line-height:18px}
.dshr-footer-summary{display:inline-flex;align-items:baseline;gap:6px;min-width:0;white-space:nowrap}
.dshr-footer-label{color:var(--dsw-alias-label-tertiary,#7a837d)}
.dshr-footer-summary strong{color:var(--dsw-alias-label-primary,#1d221f);font-size:12px;font-weight:650;font-variant-numeric:tabular-nums}
.dshr-footer-slash{color:var(--dsw-alias-border-l1,#b8c0ba)}
.dshr-footer-source{display:inline-flex;align-items:center;gap:5px;min-width:0;padding:5px 7px;border-radius:7px;color:var(--dsw-alias-label-secondary,#667069);font-weight:500;text-decoration:none;transition:color .15s ease,background .15s ease}
.dshr-footer-source:hover{color:var(--dshr-brand);background:var(--dshr-brand-soft)}
.dshr-footer-source span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dshr-footer-source-arrow{flex:none;color:var(--dshr-brand);font-size:13px}
.dshr-skeleton-list{display:flex;flex-direction:column;gap:14px}
.dshr-skeleton-card{display:flex;flex-direction:column;gap:12px;padding:18px;border:1px solid var(--dsw-alias-border-l2,#e0e5e1);border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff)}
.dshr-skeleton-title,.dshr-skeleton-line,.dshr-skeleton-evidence span,.dshr-skeleton-command{border-radius:7px;background:linear-gradient(90deg,var(--dsw-alias-bg-layer-2,#f0f3f1) 22%,color-mix(in srgb,var(--dsw-alias-bg-layer-2,#f0f3f1) 62%,#fff) 42%,var(--dsw-alias-bg-layer-2,#f0f3f1) 62%);background-size:350% 100%;animation:dshr-shimmer 1.25s ease-in-out infinite}
.dshr-skeleton-title{width:34%;height:22px}
.dshr-skeleton-line{width:70%;height:14px}
.dshr-skeleton-line-wide{width:92%}
.dshr-skeleton-evidence{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dshr-skeleton-evidence span{height:56px}
.dshr-skeleton-command{height:38px}
@keyframes dshr-spin{to{transform:rotate(360deg)}}
@keyframes dshr-progress{0%{transform:translateX(-120%)}50%{transform:translateX(120%)}100%{transform:translateX(310%)}}
@keyframes dshr-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
@media(max-width:760px){
  .dshr-toolbar{grid-template-columns:1fr}
  .dshr-sort-button{width:100%!important}
  .dshr-evidence-grid{grid-template-columns:1fr}
  .dshr-card-footer{align-items:flex-start;flex-direction:column}
  .dshr-details{align-self:flex-end}
  .dshr-footer{align-items:flex-start;flex-direction:column;gap:8px}
  .dshr-footer-source{margin-left:-7px}
}
@media(max-width:520px){
  .dshr-head,.dshr-body{padding-left:4px;padding-right:4px}
  .dshr-card{padding:14px}
  .dshr-card-header{align-items:flex-start}
  .dshr-status{max-width:120px;overflow:hidden;text-overflow:ellipsis}
  .dshr-plugin-glyph{width:38px;height:38px}
}
`;
