<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/ci-logo.svg';
	import egLogo from '$lib/images/eg-logo-white.png';

	$: currentPath = $page.url.pathname;
</script>

<header>
	<div class="navbar h-100px">
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
					<li class="nav-item" class:active={currentPath.startsWith('/map-chat')}><a href="/map-chat">Map Chat</a></li>
					<li class="nav-item" class:active={currentPath.startsWith('/multiagent-chat')}><a href="/multiagent-chat">CI Research Chat</a></li>
				</ul>
			</div>
			<a href="/" class="btn btn-ghost">
				<img class="ci-logo" src={logo} alt="CI Logo" />
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li class="nav-item" class:active={currentPath === '/'}><a href="/">Home</a></li>
				<li class="nav-item" class:active={currentPath.startsWith('/map-chat')}><a href="/map-chat">Map Chat</a></li>
				<li class="nav-item" class:active={currentPath.startsWith('/multiagent-chat')}><a href="/multiagent-chat">CI Research Chat</a></li>
			</ul>
		</div>
		<div class="navbar-end">
			<a class="btn btn-ghost" href="https://www.earthgenome.org/">
				<img class="eg-logo" src={egLogo} alt="Earth Genome" />
			</a>
		</div>
	</div>
</header>

<style>
	header {
		background-color: #2C665D;
		border-bottom: 1px solid #F1E9D2;
	}
	.navbar {
		color: #F1E9D2;
	}
	.eg-logo {
		width: 5em;
	}
	.ci-logo {
		width: 7em;
	}
	.nav-item {
		border-radius: 0.5rem;
		transition: background-color 0.3s ease;
	}
	.nav-item:hover {
		background-color: #1d443e;
	}
	.nav-item.active {
		background-color: #1d443e;
	}
	.nav-item a {
		font-weight: bold;
		padding: 0.5rem 1rem;
	}
	:global(.menu-horizontal) {
		gap: 0.5rem;
	}
</style>
