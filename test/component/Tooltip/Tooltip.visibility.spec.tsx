import React, { ComponentType, ReactNode, useState } from 'react';
import { afterEach, describe, expect, it, test } from 'vitest';
import { fireEvent, getByText, render } from '@testing-library/react';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  Sankey,
  Scatter,
  ScatterChart,
  SunburstChart,
  Tooltip,
  XAxis,
  YAxis,
} from '../../../src';
import { mockGetBoundingClientRect, restoreGetBoundingClientRect } from '../../helper/mockGetBoundingClientRect';
import { PageData, SankeyData, exampleSunburstData } from '../../_data';
import { getTooltip, showTooltip } from './tooltipTestHelpers';
import {
  areaChartMouseHoverTooltipSelector,
  barChartMouseHoverTooltipSelector,
  composedChartMouseHoverTooltipSelector,
  lineChartMouseHoverTooltipSelector,
  MouseHoverTooltipTriggerSelector,
  pieChartMouseHoverTooltipSelector,
  radarChartMouseHoverTooltipSelector,
  radialBarChartMouseHoverTooltipSelector,
  sankeyNodeChartMouseHoverTooltipSelector,
  scatterChartMouseHoverTooltipSelector,
  sunburstChartMouseHoverTooltipSelector,
} from './tooltipMouseHoverSelectors';

type TooltipVisibilityTestCase = {
  // For identifying which test is running
  name: string;
  mouseHoverSelector: MouseHoverTooltipTriggerSelector;
  Wrapper: ComponentType<{ children: ReactNode }>;
};

const commonChartProps = {
  width: 400,
  height: 400,
  data: PageData,
};

const AreaChartTestCase: TooltipVisibilityTestCase = {
  name: 'AreaChart',
  Wrapper: ({ children }) => (
    <AreaChart {...commonChartProps}>
      <Area dataKey="uv" />
      {children}
    </AreaChart>
  ),
  mouseHoverSelector: areaChartMouseHoverTooltipSelector,
};

const BarChartTestCase: TooltipVisibilityTestCase = {
  name: 'BarChart',
  Wrapper: ({ children }) => (
    <BarChart {...commonChartProps}>
      <Bar dataKey="uv" />
      {children}
    </BarChart>
  ),
  mouseHoverSelector: barChartMouseHoverTooltipSelector,
};

const LineChartHorizontalTestCase: TooltipVisibilityTestCase = {
  name: 'horizontal LineChart',
  Wrapper: ({ children }) => (
    <LineChart {...commonChartProps}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      {children}
      <Legend />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  ),
  mouseHoverSelector: lineChartMouseHoverTooltipSelector,
};

const LineChartVerticalTestCase: TooltipVisibilityTestCase = {
  name: 'vertical LineChart',
  Wrapper: ({ children }) => (
    <LineChart
      layout="vertical"
      {...commonChartProps}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" />
      {children}
      <Legend />
      <Line dataKey="uv" stroke="#82ca9d" />
    </LineChart>
  ),
  mouseHoverSelector: lineChartMouseHoverTooltipSelector,
};

const ComposedChartWithAreaTestCase: TooltipVisibilityTestCase = {
  name: 'ComposedChart with Area',
  Wrapper: ({ children }) => (
    <ComposedChart {...commonChartProps}>
      <XAxis dataKey="name" type="category" />
      <YAxis dataKey="uv" />
      {children}
      <Area dataKey="pv" />
    </ComposedChart>
  ),
  mouseHoverSelector: composedChartMouseHoverTooltipSelector,
};

const ComposedChartWithBarTestCase: TooltipVisibilityTestCase = {
  name: 'ComposedChart with Bar',
  Wrapper: ({ children }) => (
    <ComposedChart {...commonChartProps}>
      <XAxis dataKey="name" type="category" />
      <YAxis dataKey="uv" />
      {children}
      <Bar dataKey="amt" />
    </ComposedChart>
  ),
  mouseHoverSelector: composedChartMouseHoverTooltipSelector,
};

const ComposedChartWithLineTestCase: TooltipVisibilityTestCase = {
  name: 'ComposedChart with Line',
  Wrapper: ({ children }) => (
    <ComposedChart {...commonChartProps}>
      <XAxis dataKey="name" type="category" />
      <YAxis dataKey="amt" />
      {children}
      <Line dataKey="pv" />
    </ComposedChart>
  ),
  mouseHoverSelector: composedChartMouseHoverTooltipSelector,
};

const PieChartTestCase: TooltipVisibilityTestCase = {
  name: 'PieChart',
  Wrapper: ({ children }) => (
    <PieChart height={400} width={400}>
      <Pie data={PageData} isAnimationActive={false} dataKey="uv" nameKey="name" cx={200} cy={200} />
      {children}
    </PieChart>
  ),
  mouseHoverSelector: pieChartMouseHoverTooltipSelector,
};

const RadarChartTestCase: TooltipVisibilityTestCase = {
  name: 'RadarChart',
  Wrapper: ({ children }) => (
    <RadarChart height={600} width={600} data={PageData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      <PolarRadiusAxis />
      <Radar name="Mike" dataKey="uv" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      {children}
    </RadarChart>
  ),
  mouseHoverSelector: radarChartMouseHoverTooltipSelector,
};

const RadialBarChartTestCase: TooltipVisibilityTestCase = {
  name: 'RadialBarChart',
  Wrapper: ({ children }) => (
    <RadialBarChart height={600} width={600} data={PageData}>
      <PolarGrid />
      <PolarAngleAxis dataKey="name" />
      <PolarRadiusAxis />
      <RadialBar name="Mike" dataKey="uv" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
      {children}
    </RadialBarChart>
  ),
  mouseHoverSelector: radialBarChartMouseHoverTooltipSelector,
};

const SankeyTestCase: TooltipVisibilityTestCase = {
  name: 'Sankey',
  Wrapper: ({ children }) => (
    <Sankey width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} data={SankeyData}>
      {children}
    </Sankey>
  ),
  mouseHoverSelector: sankeyNodeChartMouseHoverTooltipSelector,
};

const ScatterChartTestCase: TooltipVisibilityTestCase = {
  name: 'ScatterChart',
  Wrapper: ({ children }) => (
    <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
      <XAxis dataKey="uv" name="stature" unit="cm" />
      <YAxis dataKey="pv" name="weight" unit="kg" />
      <Scatter line name="A school" data={PageData} fill="#ff7300" />
      {children}
    </ScatterChart>
  ),
  mouseHoverSelector: scatterChartMouseHoverTooltipSelector,
};

const SunburstChartTestCase: TooltipVisibilityTestCase = {
  name: 'SunburstChart',
  Wrapper: ({ children }) => (
    <SunburstChart width={400} height={400} data={exampleSunburstData}>
      <Tooltip />
      {children}
    </SunburstChart>
  ),
  mouseHoverSelector: sunburstChartMouseHoverTooltipSelector,
};

const testCases: ReadonlyArray<TooltipVisibilityTestCase> = [
  AreaChartTestCase,
  BarChartTestCase,
  LineChartHorizontalTestCase,
  LineChartVerticalTestCase,
  ComposedChartWithAreaTestCase,
  ComposedChartWithBarTestCase,
  ComposedChartWithLineTestCase,
  PieChartTestCase,
  RadarChartTestCase,
  RadialBarChartTestCase,
  SankeyTestCase,
  ScatterChartTestCase,
  // Sunburst is excluded because it renders tooltip multiple times and all tests fail :( TODO fix and re-enable
  // SunburstChartTestCase,
  // FunnelChart is excluded because FunnelChart does not support Tooltip
];

describe('Tooltip visibility', () => {
  afterEach(restoreGetBoundingClientRect);

  describe.each(testCases)('as a child of $name', ({ name, Wrapper, mouseHoverSelector }) => {
    test('Without an event, the tooltip wrapper is rendered but not visible', () => {
      const { container } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );

      const wrapper = getTooltip(container);
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).not.toBeVisible();
    });

    test('No content is rendered without an explicit event', () => {
      const { container } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );

      const tooltipContentName = container.querySelector('.recharts-tooltip-item-name');
      const tooltipContentValue = container.querySelector('.recharts-tooltip-item-value');
      expect(tooltipContentName).toBeNull();
      expect(tooltipContentValue).toBeNull();
    });

    test(`Mouse over element ${mouseHoverSelector} renders content`, () => {
      const { container, debug } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );

      showTooltip(container, mouseHoverSelector, debug);

      // After the mouse over event over the chart, the tooltip wrapper still is not set to visible,
      // but the content is already created based on the nearest data point.
      const tooltipContentName = container.querySelector('.recharts-tooltip-item-name');
      const tooltipContentValue = container.querySelector('.recharts-tooltip-item-value');
      expect(tooltipContentName).not.toBeNull();
      expect(tooltipContentValue).not.toBeNull();
      expect(tooltipContentName).toBeInTheDocument();
      expect(tooltipContentValue).toBeInTheDocument();
    });

    test('Should move when the mouse moves', async () => {
      mockGetBoundingClientRect({
        width: 10,
        height: 10,
      });
      const { container, debug } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );

      const tooltipTriggerElement = showTooltip(container, mouseHoverSelector);
      fireEvent.mouseMove(tooltipTriggerElement, { clientX: 201, clientY: 201 });
      debug();
      const tooltip = getTooltip(container);
      expect(tooltip.getAttribute('style')).toContain('translate');
    });

    it('should render customized tooltip when content is set to be a react element', () => {
      const Customized = () => {
        return <div className="customized" />;
      };
      const { container } = render(
        <Wrapper>
          <Tooltip content={<Customized />} />
        </Wrapper>,
      );

      showTooltip(container, mouseHoverSelector);

      const customizedContent = container.querySelector('.customized');
      expect(customizedContent).toBeInTheDocument();
    });

    describe('active prop', () => {
      test('with active=true it should render tooltip even after moving the mouse out of the chart.', context => {
        if (name === 'Sankey') {
          /*
           * Sankey chart for some reason ignores active property on Tooltip
           */
          context.skip();
        }
        const { container } = render(
          <Wrapper>
            <Tooltip active />
          </Wrapper>,
        );

        const tooltip = getTooltip(container);
        expect(tooltip).not.toBeVisible();

        const tooltipTriggerElement = showTooltip(container, mouseHoverSelector);

        expect(tooltip).toBeVisible();

        fireEvent.mouseOut(tooltipTriggerElement);

        // Still visible after moving out of the chart, because active is true.
        expect(tooltip).toBeVisible();
      });

      test('with active=false it should never render tooltip', context => {
        if (name === 'Sankey') {
          /*
           * Sankey chart for some reason ignores active property on Tooltip
           */
          context.skip();
        }
        const { container } = render(
          <Wrapper>
            <Tooltip active={false} />
          </Wrapper>,
        );

        const tooltip = getTooltip(container);
        expect(tooltip).not.toBeVisible();

        const tooltipTriggerElement = showTooltip(container, mouseHoverSelector);

        expect(tooltip).not.toBeVisible();

        fireEvent.mouseOut(tooltipTriggerElement);

        expect(tooltip).not.toBeVisible();
      });

      test('with active=undefined it should render the Tooltip only while in the chart', () => {
        const { container } = render(
          <Wrapper>
            <Tooltip />
          </Wrapper>,
        );

        const tooltip = getTooltip(container);
        expect(tooltip).not.toBeVisible();

        const tooltipTriggerElement = showTooltip(container, mouseHoverSelector);

        expect(tooltip).toBeVisible();

        fireEvent.mouseOut(tooltipTriggerElement);

        expect(tooltip).not.toBeVisible();
      });
    });

    describe('defaultIndex prop', () => {
      it('should show tooltip from the beginning if defaultIndex is set to a valid value', context => {
        if (name === 'RadialBarChart') {
          /*
           * RadialBarChart throws an error when called with defaultIndex!
           * Error: Uncaught [TypeError: Cannot read properties of undefined (reading 'coordinate')]
           * at CategoricalChartWrapper.displayDefaultTooltip
           */
          // IntelliJ (incorrectly) reports this as test failure - but CLI says it's skipped. Since CLI is the source of truth I leave this here.
          context.skip();
        }
        if (name === 'Sankey') {
          /*
           * Sankey chart for some reason ignores defaultIndex property on Tooltip
           */
          context.skip();
        }
        const { container } = render(
          <Wrapper>
            <Tooltip defaultIndex={2} />
          </Wrapper>,
        );

        const tooltip = getTooltip(container);
        expect(tooltip).toBeInTheDocument();

        // Tooltip should be visible, since defaultIndex was set
        expect(tooltip).toBeVisible();

        const tooltipTriggerElement = showTooltip(container, mouseHoverSelector);

        // Tooltip should be able to move when the mouse moves over the chart
        expect(tooltip).toBeVisible();

        fireEvent.mouseOver(tooltipTriggerElement, { clientX: 350, clientY: 200 });

        // Tooltip should be able to move when the mouse moves over the chart
        expect(tooltip).toBeVisible();

        fireEvent.mouseOut(tooltipTriggerElement);

        // Since active is false, the tooltip can be dismissed by mousing out
        expect(tooltip).not.toBeVisible();
      });

      it('should ignore invalid defaultIndex value', () => {
        const { container } = render(
          <Wrapper>
            <Tooltip defaultIndex={20} />
          </Wrapper>,
        );

        const tooltip = getTooltip(container);
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).not.toBeVisible();
      });
    });
  });

  describe('includeHidden prop', () => {
    test('true - Should render tooltip for hidden items', () => {
      let tooltipPayload: any[] | undefined = [];

      const { container } = render(
        <ComposedChart width={400} height={400} data={PageData}>
          <Area dataKey="uv" hide name="1" />
          <Bar dataKey="uv" hide name="2" />
          <Line dataKey="uv" hide name="3" />
          <Scatter dataKey="uv" hide name="4" />
          <Line dataKey="uv" name="5" />
          <Tooltip
            includeHidden
            content={({ payload }) => {
              tooltipPayload = payload;
              return null;
            }}
          />
        </ComposedChart>,
      );

      expect(tooltipPayload).toHaveLength(0);

      const chart = container.querySelector('.recharts-wrapper');
      fireEvent.mouseOver(chart!, { clientX: 200, clientY: 200 });

      expect(tooltipPayload.map(({ name }) => name).join('')).toBe('12345');
    });

    test('false - Should hide tooltip for hidden items', () => {
      let tooltipPayload: any[] | undefined = [];

      const { container } = render(
        <ComposedChart width={400} height={400} data={PageData}>
          <Area dataKey="uv" hide name="1" />
          <Bar dataKey="uv" hide name="2" />
          <Line dataKey="uv" hide name="3" />
          <Scatter dataKey="uv" hide name="4" />
          <Line dataKey="uv" name="5" />
          <Tooltip
            includeHidden={false}
            content={({ payload }) => {
              tooltipPayload = payload;
              return null;
            }}
          />
        </ComposedChart>,
      );

      expect(tooltipPayload).toHaveLength(0);

      const chart = container.querySelector('.recharts-wrapper');
      fireEvent.mouseOver(chart!, { clientX: 200, clientY: 200 });

      expect(tooltipPayload.map(({ name }) => name).join('')).toBe('5');
    });
  });

  it('Should display the data selected by Brush', () => {
    const { container } = render(
      <LineChart width={600} height={300} data={PageData}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Brush dataKey="name" startIndex={1} height={30} stroke="#8884d8" />
        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>,
    );

    const line = container.querySelector('.recharts-cartesian-grid-horizontal line')!;
    const chart = container.querySelector('.recharts-wrapper');
    fireEvent.mouseOver(chart!, { clientX: +line.getAttribute('x')! + 1, clientY: 50 });
    expect(getByText(container, '4567')).toBeVisible();
  });

  test('defaultIndex can be updated by parent control', () => {
    const data2 = [
      { x: 100, y: 200, z: 200 },
      { x: 120, y: 100, z: 260 },
      { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 },
      { x: 150, y: 400, z: 500 },
      { x: 110, y: 280, z: 200 },
    ];
    const Example = () => {
      const [defaultIndex, setDefaultIndex] = useState(0);

      return (
        <div>
          <ScatterChart width={400} height={400} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis dataKey="x" name="stature" unit="cm" />
            <YAxis dataKey="y" name="weight" unit="kg" />
            <Scatter line name="A school" data={data2} fill="#ff7300" />
            <Tooltip defaultIndex={defaultIndex} active />
          </ScatterChart>
          <button type="button" id="goRight" onClick={() => setDefaultIndex(defaultIndex + 1)}>
            Go right
          </button>
        </div>
      );
    };
    const { container } = render(<Example />);

    const tooltip = getTooltip(container);
    expect(tooltip).toBeInTheDocument();

    // Tooltip should be visible, since defaultIndex was set
    expect(tooltip).toBeVisible();

    // The cursor should also be visible
    expect(container.querySelector('.recharts-tooltip-cursor')).toBeVisible();

    // Data should be displayed in the Tooltip payload
    expect(tooltip.textContent).toBe('100stature : 100cmweight : 200kg');

    fireEvent.click(container.querySelector('#goRight') as HTMLButtonElement);

    // Data should be displayed in the Tooltip payload
    expect(tooltip?.textContent).toBe('120stature : 120cmweight : 100kg');
  });
});

describe('Active element visibility', () => {
  afterEach(restoreGetBoundingClientRect);

  describe.each([
    AreaChartTestCase,
    LineChartHorizontalTestCase,
    LineChartVerticalTestCase,
    ComposedChartWithAreaTestCase,
    ComposedChartWithLineTestCase,
    RadarChartTestCase,
  ])('as a child of $name', ({ Wrapper, mouseHoverSelector }) => {
    it('should display activeDot', () => {
      const { container, debug } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );
      expect(container.querySelector('.recharts-active-dot')).not.toBeInTheDocument();

      showTooltip(container, mouseHoverSelector, debug);

      expect(container.querySelector('.recharts-active-dot')).toBeVisible();
    });
  });

  describe.each([
    BarChartTestCase,
    ComposedChartWithBarTestCase,
    PieChartTestCase,
    RadialBarChartTestCase,
    SankeyTestCase,
    ScatterChartTestCase,
    SunburstChartTestCase,
  ])('as a child of $name', ({ Wrapper, mouseHoverSelector }) => {
    it('should not display activeDot', () => {
      const { container, debug } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );
      expect(container.querySelector('.recharts-active-dot')).not.toBeInTheDocument();

      showTooltip(container, mouseHoverSelector, debug);

      expect(container.querySelector('.recharts-active-dot')).not.toBeInTheDocument();
    });
  });
});

describe('Cursor visibility', () => {
  afterEach(restoreGetBoundingClientRect);

  describe.each([
    AreaChartTestCase,
    BarChartTestCase,
    LineChartHorizontalTestCase,
    LineChartVerticalTestCase,
    ComposedChartWithAreaTestCase,
    ComposedChartWithLineTestCase,
    RadarChartTestCase,
  ])('as a child of $name', ({ Wrapper, mouseHoverSelector }) => {
    it('should display cursor', () => {
      const { container, debug } = render(
        <Wrapper>
          <Tooltip />
        </Wrapper>,
      );
      expect(container.querySelector('.recharts-tooltip-cursor')).not.toBeInTheDocument();

      showTooltip(container, mouseHoverSelector, debug);

      expect(container.querySelector('.recharts-tooltip-cursor')).toBeVisible();
    });

    it('should not display cursor when cursor=false', () => {
      const { container, debug } = render(
        <Wrapper>
          <Tooltip cursor={false} />
        </Wrapper>,
      );
      expect(container.querySelector('.recharts-tooltip-cursor')).not.toBeInTheDocument();

      showTooltip(container, mouseHoverSelector, debug);

      expect(container.querySelector('.recharts-tooltip-cursor')).not.toBeInTheDocument();
    });
  });
});
