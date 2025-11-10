// BEFORE: 정적 임포트 (모든 코드가 초기 번들에 포함)
import { heavyLibrary } from './heavyLibrary';
import { chartLibrary } from './chartLibrary';
import { modalComponent } from './modalComponent';

class App {
  constructor() {
    // 모든 라이브러리가 처음부터 로드됨
    this.heavy = heavyLibrary;
    this.chart = chartLibrary;
    this.modal = modalComponent;
  }
}

// AFTER: 동적 임포트 (필요할 때만 로드)
class OptimizedApp {
  constructor() {
    this.loadedModules = new Map();
  }

  // 1. 라우트 기반 동적 로딩
  async loadPage(pageName) {
    try {
      const pageModule = await import(
        /* webpackChunkName: "page-[request]" */
        `./pages/${pageName}Page.js`
      );
      return pageModule.default;
    } catch (error) {
      console.error(`Failed to load page: ${pageName}`, error);
      return null;
    }
  }

  // 2. 기능 기반 동적 로딩
  async loadHeavyFeature() {
    if (!this.loadedModules.has('heavy')) {
      const { heavyLibrary } = await import(
        /* webpackChunkName: "heavy-feature" */
        './heavyLibrary'
      );
      this.loadedModules.set('heavy', heavyLibrary);
    }
    return this.loadedModules.get('heavy');
  }

  // 3. 차트 라이브러리 지연 로딩
  async showChart(data) {
    const { chartLibrary } = await import(
      /* webpackChunkName: "chart-lib" */
      /* webpackPreload: true */
      './chartLibrary'
    );
    
    return chartLibrary.render(data);
  }

  // 4. 모달 컴포넌트 지연 로딩
  async openModal(content) {
    const { modalComponent } = await import(
      /* webpackChunkName: "modal" */
      /* webpackPrefetch: true */
      './modalComponent'
    );
    
    return modalComponent.open(content);
  }

  // 5. 조건부 동적 로딩
  async loadFeatureBasedOnCondition(userType) {
    if (userType === 'admin') {
      const { adminPanel } = await import(
        /* webpackChunkName: "admin-panel" */
        './components/AdminPanel'
      );
      return adminPanel;
    } else if (userType === 'premium') {
      const { premiumFeatures } = await import(
        /* webpackChunkName: "premium-features" */
        './components/PremiumFeatures'
      );
      return premiumFeatures;
    }
    return null;
  }

  // 6. 병렬 동적 로딩
  async loadMultipleModules() {
    const [
      { utilityA },
      { utilityB },
      { utilityC }
    ] = await Promise.all([
      import(/* webpackChunkName: "utility-a" */ './utils/utilityA'),
      import(/* webpackChunkName: "utility-b" */ './utils/utilityB'),
      import(/* webpackChunkName: "utility-c" */ './utils/utilityC'),
    ]);

    return { utilityA, utilityB, utilityC };
  }

  // 7. 에러 처리가 포함된 동적 로딩
  async safeLoadModule(modulePath, fallback = null) {
    try {
      const module = await import(modulePath);
      return module.default || module;
    } catch (error) {
      console.warn(`Failed to load module ${modulePath}:`, error);
      
      // 폴백 모듈 로드 시도
      if (fallback) {
        try {
          const fallbackModule = await import(fallback);
          return fallbackModule.default || fallbackModule;
        } catch (fallbackError) {
          console.error('Fallback module also failed:', fallbackError);
        }
      }
      
      return null;
    }
  }
}

// 8. React 컴포넌트에서의 동적 임포트 (React.lazy)
const DynamicComponents = {
  // 기본 동적 컴포넌트
  LazyComponent: React.lazy(() => import('./components/HeavyComponent')),
  
  // 에러 바운더리와 함께
  LazyComponentWithFallback: React.lazy(() => 
    import('./components/HeavyComponent')
      .catch(() => import('./components/FallbackComponent'))
  ),
  
  // 지연 시간 추가
  LazyComponentWithDelay: React.lazy(() => 
    Promise.all([
      import('./components/HeavyComponent'),
      new Promise(resolve => setTimeout(resolve, 300)) // 최소 300ms 대기
    ]).then(([module]) => module)
  ),
};

// 9. 사용 예시
export class BundleOptimizedApp extends OptimizedApp {
  async init() {
    // 초기 필수 모듈만 로드
    const coreModule = await import('./core');
    this.core = coreModule.default;
    
    // 사용자 상호작용에 따라 추가 모듈 로드
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.getElementById('chart-button')?.addEventListener('click', async () => {
      const chartData = await this.fetchChartData();
      await this.showChart(chartData);
    });

    document.getElementById('admin-button')?.addEventListener('click', async () => {
      const userType = this.getCurrentUserType();
      await this.loadFeatureBasedOnCondition(userType);
    });
  }
}

export default OptimizedApp;