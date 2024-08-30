<script>
    import { onMount } from 'svelte';
  
    let isMobile = false;
  
    function checkMobile() {
      isMobile = window.innerWidth < 768; // Adjust this breakpoint as needed
    }
  
    onMount(() => {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    });
  </script>
  
  <div class="h-screen flex flex-col">
    <div class="card bg-secondary shadow-xl h-[15vh] w-full overflow-y-auto">
      <div class="card-body">
        <h2 class="card-title">Top Card</h2>
        <p>This card takes up 15% of the page height and full width.</p>
      </div>
    </div>
  
    <div class="flex-1 flex {isMobile ? 'flex-col' : 'flex-row'} overflow-hidden">
      <div class="card bg-primary shadow-xl {isMobile ? 'h-[42.5vh]' : 'w-1/2'} overflow-y-auto">
        <div class="card-body">
          <h2 class="card-title">Left/Middle Card</h2>
          <p>This card takes up half of the remaining space (or stacks on mobile).</p>
          <!-- Add more content here to test scrolling -->
        </div>
      </div>
  
      <div class="card bg-primary shadow-xl {isMobile ? 'h-[42.5vh]' : 'w-1/2'} overflow-y-auto">
        <div class="card-body">
          <h2 class="card-title">Right/Bottom Card</h2>
          <p>This card takes up the other half of the remaining space (or stacks on mobile).</p>
          <!-- Add more content here to test scrolling -->
        </div>
      </div>
    </div>
  </div>
  
  <style>
    /* Add any additional styles here if needed */
  </style>