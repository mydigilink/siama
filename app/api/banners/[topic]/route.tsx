import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const bannerConfig: Record<string, {
  title: string;
  subtitle: string;
  gradient: string[];
  icon: string;
  features: string[];
}> = {
  'laser-hair-reduction': {
    title: 'Laser Hair Reduction',
    subtitle: 'Smooth, Hair-Free Skin with Advanced Technology',
    gradient: ['#FF6B6B', '#FF8E53', '#FF6B9D'],
    icon: '✨',
    features: ['US FDA Approved', 'Painless Treatment', 'Long Lasting Results']
  },
  'skin-rejuvenation': {
    title: 'Skin Rejuvenation',
    subtitle: 'Rediscover Your Natural Glow',
    gradient: ['#667eea', '#764ba2', '#f093fb'],
    icon: '🌟',
    features: ['Advanced Technology', 'Expert Care', 'Proven Results']
  },
  'hair-treatment': {
    title: 'Hair Treatment',
    subtitle: 'Restore Your Hair\'s Natural Beauty',
    gradient: ['#4facfe', '#00f2fe', '#43e97b'],
    icon: '💆',
    features: ['PRP Therapy', 'Mesotherapy', 'Hair Regrowth']
  },
  'advanced-laser-facial': {
    title: 'Advanced Laser Facial',
    subtitle: 'Transform Your Skin with Precision',
    gradient: ['#fa709a', '#fee140', '#ff6e7f'],
    icon: '🔬',
    features: ['Multi-Laser Technology', 'Customized Treatment', 'Instant Results']
  },
  'prp-treatment': {
    title: 'PRP Treatment',
    subtitle: 'Natural Healing with Your Own Blood',
    gradient: ['#a8edea', '#fed6e3', '#ff9a9e'],
    icon: '💉',
    features: ['100% Natural', 'No Side Effects', 'Visible Results']
  },
  'chemical-peel': {
    title: 'Chemical Peel',
    subtitle: 'Reveal Fresh, Radiant Skin',
    gradient: ['#ffecd2', '#fcb69f', '#ff8a80'],
    icon: '🌸',
    features: ['Deep Exfoliation', 'Even Skin Tone', 'Reduced Pigmentation']
  },
  'hydrafacial': {
    title: 'HydraFacial',
    subtitle: 'Deep Cleansing & Hydration in One',
    gradient: ['#89f7fe', '#66a6ff', '#a8c0ff'],
    icon: '💧',
    features: ['Instant Glow', 'Deep Hydration', 'Suitable for All Skin']
  },
  'mesotherapy': {
    title: 'Mesotherapy',
    subtitle: 'Targeted Treatment for Perfect Skin',
    gradient: ['#fbc2eb', '#a6c1ee', '#f6d365'],
    icon: '💫',
    features: ['Micro-Injections', 'Targeted Treatment', 'Minimal Downtime']
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ topic: string }> }
) {
  const { topic } = await params;
  const config = bannerConfig[topic] || bannerConfig['laser-hair-reduction'];

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${config.gradient[0]} 0%, ${config.gradient[1]} 50%, ${config.gradient[2]} 100%)`,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          position: 'relative',
        }}
      >
        {/* Indian-inspired decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)',
          }}
        />
        
        {/* Mandala-inspired pattern overlay */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Main content card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 100px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '30px',
            boxShadow: '0 30px 80px rgba(0, 0, 0, 0.2)',
            maxWidth: '90%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Decorative Indian pattern at top - Mandala inspired */}
          <div
            style={{
              fontSize: '45px',
              marginBottom: '20px',
              opacity: 0.4,
              letterSpacing: '8px',
            }}
          >
            ✨ 🌸 💫 🌺 ✨
          </div>

          {/* Icon */}
          <div
            style={{
              fontSize: '100px',
              marginBottom: '30px',
            }}
          >
            {config.icon}
          </div>

          {/* Title with Indian-inspired styling */}
          <div
            style={{
              fontSize: '85px',
              fontWeight: '800',
              background: `linear-gradient(135deg, ${config.gradient[0]} 0%, ${config.gradient[2]} 100%)`,
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '25px',
              letterSpacing: '-2px',
              textAlign: 'center',
              lineHeight: '1.1',
            }}
          >
            {config.title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: '#4a5568',
              textAlign: 'center',
              marginBottom: '40px',
              fontWeight: '600',
              lineHeight: '1.3',
            }}
          >
            {config.subtitle}
          </div>

          {/* Features with Indian aesthetic */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              marginTop: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {config.features.map((feature, index) => (
              <div
                key={index}
                style={{
                  fontSize: '22px',
                  color: config.gradient[0],
                  fontWeight: '600',
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, ${config.gradient[0]}15 0%, ${config.gradient[2]}15 100%)`,
                  borderRadius: '25px',
                  border: `2px solid ${config.gradient[0]}30`,
                }}
              >
                {feature}
              </div>
            ))}
          </div>

          {/* Siama branding */}
          <div
            style={{
              marginTop: '50px',
              fontSize: '28px',
              color: '#667eea',
              fontWeight: '700',
              letterSpacing: '2px',
            }}
          >
            SIAMA
          </div>
          <div
            style={{
              fontSize: '18px',
              color: '#718096',
              marginTop: '8px',
              fontWeight: '500',
            }}
          >
            Rediscover your natural radiance
          </div>
        </div>
      </div>
    ),
    {
      width: 1920, // More than 1003px as requested
      height: 1080,
    }
  );
}

