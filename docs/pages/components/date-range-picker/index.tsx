import * as React from 'react';
import * as dateFns from 'date-fns';
import { DateRangePicker, Button, Divider } from 'rsuite';
import DefaultPage from '@/components/Page';

export default function Page() {
  return (
    <DefaultPage
      examples={[
        'basic',
        'appearance',
        'size',
        'block',
        'placeholder',
        'hover-range',
        'one-tap',
        'show-week-numbers',
        'show-only-calendar',
        'disabled',
        'toolbar',
        'value',
        'intl',
        'time-zone'
      ]}
      dependencies={{ DateRangePicker, Button, Divider, dateFns }}
    />
  );
}
