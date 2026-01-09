import React, { useState, useEffect } from 'react';
import { Save, Palette, Eye, EyeOff, RefreshCw, Download, Upload } from 'lucide-react';
import { Button, Input, Slider, notification, Card, Switch, Row, Col, Typography, Divider } from 'antd';

const { Title, Text } = Typography;

interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  fontFamily: string;
  darkMode: boolean;
}

export const ThemeConfigView: React.FC = () => {
  const [config, setConfig] = useState<ThemeConfig>({
    primaryColor: '#f47936',
    secondaryColor: '#2d3748',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
    darkMode: false
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Load saved config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      } catch (e) {
        console.warn('Failed to parse saved theme config');
      }
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--primary-50', adjustColor(config.primaryColor, 95));
    root.style.setProperty('--primary-100', adjustColor(config.primaryColor, 90));
    root.style.setProperty('--primary-200', adjustColor(config.primaryColor, 80));
    root.style.setProperty('--primary-300', adjustColor(config.primaryColor, 70));
    root.style.setProperty('--primary-400', adjustColor(config.primaryColor, 60));
    root.style.setProperty('--primary-500', config.primaryColor);
    root.style.setProperty('--primary-600', adjustColor(config.primaryColor, 40));
    root.style.setProperty('--primary-700', adjustColor(config.primaryColor, 30));
    root.style.setProperty('--primary-800', adjustColor(config.primaryColor, 20));
    root.style.setProperty('--primary-900', adjustColor(config.primaryColor, 10));

    root.style.setProperty('--secondary-color', config.secondaryColor);
    root.style.setProperty('--border-radius', `${config.borderRadius}px`);
    root.style.setProperty('--font-family', config.fontFamily);

    if (config.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [config]);

  const handleSave = () => {
    localStorage.setItem('theme-config', JSON.stringify(config));
    notification.success({
      message: 'Theme Saved',
      description: 'Your theme configuration has been saved and applied.'
    });
  };

  const handleReset = () => {
    const defaultConfig = {
      primaryColor: '#f47936',
      secondaryColor: '#2d3748',
      borderRadius: 8,
      fontFamily: 'Inter, system-ui, sans-serif',
      darkMode: false
    };
    setConfig(defaultConfig);
    notification.info({
      message: 'Theme Reset',
      description: 'Theme has been reset to default values.'
    });
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'theme-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedConfig = JSON.parse(e.target?.result as string);
        setConfig(importedConfig);
        notification.success({
          message: 'Theme Imported',
          description: 'Theme configuration has been imported successfully.'
        });
      } catch (error) {
        notification.error({
          message: 'Import Failed',
          description: 'Invalid theme configuration file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const adjustColor = (color: string, amount: number): string => {
    // Simple color adjustment for CSS custom properties
    return color;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="text-neutral-900 dark:text-white mb-2">Theme Configuration</Title>
          <Text className="text-neutral-500 dark:text-neutral-400">
            Customize your application's visual appearance and branding
          </Text>
        </div>
        <div className="flex gap-3">
          <Button 
            icon={<Eye size={16} />}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={isPreviewMode ? 'bg-gold-500 text-black border-none' : 'border-gold-500 text-gold-500'}
          >
            {isPreviewMode ? 'Exit Preview' : 'Preview Theme'}
          </Button>
          <Button 
            type="primary" 
            icon={<Save size={16} />}
            onClick={handleSave}
            className="bg-gold-500 text-black border-none hover:bg-gold-400"
          >
            Save Theme
          </Button>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card title={<><Palette size={20} className="mr-2" /> Color Settings</>} className="h-full">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Primary Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border border-neutral-300 rounded"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig({...config, primaryColor: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <div className="w-8 h-8 rounded bg-primary-50 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-100 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-200 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-300 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-400 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-500 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-600 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-700 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-800 border"></div>
                    <div className="w-8 h-8 rounded bg-primary-900 border"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Secondary Color
                  </label>
                  <div className="flex gap-3 items-center">
                    <Input
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                      className="w-16 h-10 p-1 border border-neutral-300 rounded"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => setConfig({...config, secondaryColor: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Dark Mode
                    </label>
                    <Text className="text-xs text-neutral-500 dark:text-neutral-400 block">
                      Enable dark theme for better visibility in low light
                    </Text>
                  </div>
                  <Switch
                    checked={config.darkMode}
                    onChange={(checked) => setConfig({...config, darkMode: checked})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Border Radius: {config.borderRadius}px
                  </label>
                  <Slider
                    min={0}
                    max={24}
                    value={config.borderRadius}
                    onChange={(value) => setConfig({...config, borderRadius: value})}
                    marks={{ 0: '0px', 8: '8px', 16: '16px', 24: '24px' }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Font Family
                  </label>
                  <Input
                    value={config.fontFamily}
                    onChange={(e) => setConfig({...config, fontFamily: e.target.value})}
                    placeholder="e.g., Inter, system-ui, sans-serif"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Actions" className="h-full">
            <div className="space-y-4">
              <Button 
                block 
                icon={<RefreshCw size={16} />}
                onClick={handleReset}
                className="border-gold-500 text-gold-500 hover:bg-gold-50"
              >
                Reset to Default
              </Button>

              <Button 
                block 
                icon={<Download size={16} />}
                onClick={handleExport}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Export Theme
              </Button>

              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-4">
                <Text className="text-sm text-neutral-500 dark:text-neutral-400 block mb-2">
                  Import Theme Configuration
                </Text>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold-50 file:text-gold-700 hover:file:bg-gold-100"
                />
              </div>
            </div>
          </Card>

          {isPreviewMode && (
            <Card title="Theme Preview" className="mt-6">
              <div className="space-y-3">
                <div className="p-4 bg-primary-500 text-white rounded-lg">
                  <Text className="font-semibold">Primary Color Preview</Text>
                </div>
                <div className="p-4 bg-secondary-500 text-white rounded-lg">
                  <Text className="font-semibold">Secondary Color Preview</Text>
                </div>
                <div className="p-4 border-2 border-primary-500 rounded-lg">
                  <Text className="font-semibold">Border with Primary Color</Text>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ThemeConfigView;