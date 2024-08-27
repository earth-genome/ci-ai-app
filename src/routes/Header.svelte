<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/ci-logo.svg';
	import egLogo from '$lib/images/eg-logo.png';
</script>

<header>
	<div class="navbar bg-base-100">
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
					<li><a href="/">Home</a></li>
					<li><a href="/basic-chat">Basic Chat</a></li>
					<li><a href="/lambda-chat">Lambda Chat</a></li>
					<li><a href="/agent-chat">Agent Chat</a></li>
					<li><a href="/map-chat">Map Chat</a></li>
				</ul>
			</div>
			<a href="/" class="btn btn-ghost">
				<img class="ci-logo" src={logo} alt="CI Logo" />
			</a>
		</div>
		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal px-1">
				<li><a href="/">Home</a></li>
				<li><a href="/basic-chat">Basic Chat</a></li>
				<li><a href="/lambda-chat">Lambda Chat</a></li>
				<li><a href="/agent-chat">Agent Chat</a></li>
				<li><a href="/map-chat">Map Chat</a></li>
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
	.eg-logo {
		width: 7em;
		/* height: 5em; */
	}
	.ci-logo {
		width: 10em;
		/* height: 5em; */
	}
</style>
