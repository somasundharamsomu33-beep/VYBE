import React from 'react';
import { BadgeCheck, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export interface VerificationStatusProps {
  verified?: boolean;
  badgeType?: 'selfie_verified' | 'id_verified' | 'community_vouched' | 'unverified';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  interactive?: boolean;
  onClick?: () => void;
  onToggleDemo?: (e: React.MouseEvent) => void;
  showDemoToggle?: boolean;
  className?: string;
}

export const VerificationStatus: React.FC<VerificationStatusProps> = ({
  verified = false,
  badgeType = 'selfie_verified',
  size = 'md',
  showLabel = false,
  label,
  interactive = false,
  onClick,
  onToggleDemo,
  showDemoToggle = false,
  className = '',
}) => {
  // Dimension and typography scale
  const sizeConfig = {
    sm: {
      iconSize: 14,
      badgePadding: 'px-1.5 py-0.5',
      textClass: 'text-[10px]',
      gap: 'gap-1',
    },
    md: {
      iconSize: 16,
      badgePadding: 'px-2.5 py-1',
      textClass: 'text-xs',
      gap: 'gap-1.5',
    },
    lg: {
      iconSize: 18,
      badgePadding: 'px-3 py-1.5',
      textClass: 'text-xs font-semibold',
      gap: 'gap-2',
    },
  }[size];

  const defaultVerifiedLabel =
    badgeType === 'selfie_verified'
      ? 'Selfie Verified'
      : badgeType === 'id_verified'
      ? 'ID Verified'
      : 'Community Vouched';

  const displayLabel = label || (verified ? defaultVerifiedLabel : 'Unverified');

  // Clickable wrapper if interactive
  const Comp = interactive || onClick ? 'button' : 'div';

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Comp
        type={interactive || onClick ? 'button' : undefined}
        onClick={onClick}
        className={`inline-flex items-center ${sizeConfig.gap} ${sizeConfig.badgePadding} rounded-full transition-all ${
          verified
            ? 'bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs hover:bg-rose-100'
            : 'bg-neutral-100 text-neutral-600 border border-neutral-200 hover:bg-neutral-200/70'
        } ${interactive || onClick ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
        title={
          verified
            ? `${displayLabel} — Photo and liveness verified`
            : 'Unverified profile — Tap to start demo verification'
        }
      >
        {verified ? (
          <BadgeCheck
            size={sizeConfig.iconSize}
            className="text-rose-600 fill-rose-500/20 shrink-0"
          />
        ) : (
          <ShieldAlert
            size={sizeConfig.iconSize}
            className="text-neutral-400 shrink-0"
          />
        )}

        {showLabel && (
          <span className={`${sizeConfig.textClass} font-medium leading-none`}>
            {displayLabel}
          </span>
        )}
      </Comp>

      {/* Optional quick demo toggle switch to test verified flag */}
      {showDemoToggle && onToggleDemo && (
        <button
          type="button"
          onClick={onToggleDemo}
          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium transition-colors border ${
            verified
              ? 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
              : 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-xs'
          }`}
          title="Demo flag toggle for testing"
        >
          {verified ? 'Demo: Unverify' : 'Demo: Verify'}
        </button>
      )}
    </div>
  );
};
