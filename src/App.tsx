import { useTranslation } from "react-i18next";
import { dashboard, DashboardState } from "@lark-base-open/js-sdk";
import React, { useState, useEffect, useCallback } from 'react';
import { Button, Input, Image, Space, Form } from '@douyinfe/semi-ui';
import { useTheme, useConfig } from "./hooks/index";
import './App.scss';
import classnames from 'classnames'
import { debounce } from 'lodash';
import { ColorPicker } from "./components/ColorPicker";


interface ICarouselConfig {
  color: string;
  fontSize: number;
  showTitle: boolean;
}

function App() {

  useTheme();

  const [config, setConfig] = useState<ICarouselConfig>({
    color: 'var(--ccm-chart-N700)',
    fontSize: 14,
    showTitle: true
  });

  const [inputValue, setInputValue] = useState('');

  const isCreate = dashboard.state === DashboardState.Create
  /** 是否配置模式下 */
  const isConfig = dashboard.state === DashboardState.Config || isCreate;

  const { t } = useTranslation();

  const updateConfig = (res: any) => {
    const { customConfig } = res;
    if (customConfig) {
      setConfig(customConfig as any)
      setInputValue(customConfig.url)
      setTimeout(() => {
        // 预留3s给浏览器进行渲染，3s后告知服务端可以进行截图了
        dashboard.setRendered();
      }, 3000);
    }
  };

  useConfig(updateConfig);

  function saveConfig() {
    console.log(config);
    // 保存配置
    dashboard.saveConfig({
      customConfig: config,
      dataConditions: [],
    } as any)
  }

  return (
    <main className={classnames({
      'main-config': isConfig,
      'main': true,
    })}>
      <div className='content'>
        <div className="marquee">
          <div className="marquee-content">
            司机一杯酒，亲人两行泪...        司机一杯酒，亲人两行泪...        司机一杯酒，亲人两行泪...
          </div>
        </div>
      </div>
      {
        isConfig && (
          <div className='config-panel'>
            <Form className='form'>
              <div className='form-item'>
                <Form.Label className='label'>{t("label.link")}</Form.Label>
                <Input value={inputValue} placeholder={t("placeholder.link")} onChange={setInputValue}></Input>
              </div>

              <div className='form-item'>
                <Form.Label className='label'>{t("label.color")}</Form.Label>
                <ColorPicker value={config.color} onChange={(v) => {
                  setConfig({
                    ...config,
                    color: v,
                  })
                }}></ColorPicker>

              </div>
            </Form>
            <Button type="primary" theme="solid" className="btn" onClick={saveConfig}>
              确定
            </Button>
          </div>
        )
      }
    </main>
  );
}

export default App;
