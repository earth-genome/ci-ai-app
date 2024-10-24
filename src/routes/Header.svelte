<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/ci-logo.svg';
	import egLogo from '$lib/images/eg-logo-white.png';

	$: currentPath = $page.url.pathname;
	$: isHomePage = currentPath === '/';
</script>

<header>
	<div class="navbar">
		<div class="navbar-start">
			<div class="dropdown">
				<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h8m-8 6h16"
						/>
					</svg>
				</div>
				<ul
					class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
				>
					<li class="nav-item" class:active={currentPath === '/'}><a href="/">Home</a></li>
					<li class="nav-item" class:active={currentPath.startsWith('/map-viz-gen')}><a href="/map-viz-gen">Map Chat</a></li>
					<li class="nav-item" class:active={currentPath.startsWith('/multiagent-chat')}><a href="/multiagent-chat">CI Research Chat</a></li>
				</ul>
			</div>
			<a href="/" class="logo-button" class:home={isHomePage}>
				<img class="logo ci-logo" src={logo} alt="CI Logo" />
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">

				<li class="nav-item" class:active={isHomePage}><a href="/">Home</a></li>
				<li class="nav-item" class:active={currentPath.startsWith('/map-viz-gen')}><a href="/map-viz-gen">Map Chat</a></li>
				<li class="nav-item" class:active={currentPath.startsWith('/multiagent-chat')}><a href="/multiagent-chat">CI Research Chat</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			<a class="logo-button" class:home={isHomePage} href="https://www.earthgenome.org/">
				<img class="logo eg-logo" src={egLogo} alt="Earth Genome" />
			</a>
		</div>
	</div>
</header>

<style>
	header {
		padding-top: 1vh;
		height: 10vh; 
	}
	.navbar {
		color: #F1E9D2;
		padding-left: 10%;
		padding-right: 10%;
		height: 100%; /* Make navbar fill the header */
		display: flex;
		align-items: flex-start;
	}
	.logo-button {
		position: relative;
		display: inline-block;
		padding: 1vh;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 1.6vh;
		transition: all 0.3s ease;
	}
	.logo-button.home {
		padding: 1.5vh;
		border-radius: 2vh;
	}
	.logo-button:hover {
		background-color: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(5px);
	}
	.logo {
		width: 7vw;
		height: auto;
		object-fit: contain;
		transition: width 0.3s ease;
	}
	.logo-button.home .logo {
		width: 9vw;
	}
	.nav-item {
		border-radius: 0.5vh;
		transition: background-color 0.3s ease;
	}
	.nav-item:hover {
		background-color: rgba(29, 68, 62, 0.5);
	}
	.nav-item.active {
		background-color: rgba(29, 68, 62, 0.5);
	}
	.nav-item a {
		font-weight: bold;
		padding: 0.5vh 1vw;
	}
	:global(.menu-horizontal) {
		gap: 0.5vw;
	}
</style>
