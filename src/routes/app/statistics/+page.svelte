<script>
  import {getStatisticsFromIndexedDB} from "$lib/statistics"
  import WeeklyStatistics from "$lib/statistics/weeklyStatistics.svelte"
  import ThreeDaysStatistics from "$lib/statistics/3daysStatistics.svelte"
  import { Button, Card, Group ,Badge, Tabs } from '@svelteuidev/core';

</script>
<div class="statisticsCard">
  <Card> 
      <h2>Statistics</h2>
      <Tabs variant="outline" tabPadding="xl">
        <Tabs.Tab label='Last 3 Days'>
          <div style="margin-bottom: 50px;">
            <ThreeDaysStatistics showHasanat="true"/>
          </div> 
        </Tabs.Tab>
        <Tabs.Tab label='This Week'>
        <div style="margin-bottom: 50px;">
          <WeeklyStatistics showHasanat="true"/>
        </div> 
        </Tabs.Tab>
    </Tabs>    
  </Card>
</div>

<style>
  .statisticsCard {
    margin-bottom: 80px;
    margin-top: 20px;
    text-align: center;
  }
</style>