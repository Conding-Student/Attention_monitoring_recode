// shared/hooks/useTheme.ts

"use client";

import { useCallback, useEffect } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "theme";

function applyTheme(theme: Theme): void {
	const rootElement = document.documentElement;
	const isDarkTheme = theme === "dark";

	rootElement.classList.toggle("dark", isDarkTheme);
	rootElement.style.colorScheme = theme;
}

function resolveInitialTheme(): Theme {
	const savedTheme = window.localStorage.getItem(
		THEME_STORAGE_KEY,
	);

	if (savedTheme === "light" || savedTheme === "dark") {
		return savedTheme;
	}

	const systemPrefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)",
	).matches;

	return systemPrefersDark ? "dark" : "light";
}

export function useTheme() {
	useEffect(() => {
		applyTheme(resolveInitialTheme());
	}, []);

	const toggleTheme = useCallback(() => {
		const isCurrentlyDark =
			document.documentElement.classList.contains("dark");

		const nextTheme: Theme = isCurrentlyDark
			? "light"
			: "dark";

		applyTheme(nextTheme);

		window.localStorage.setItem(
			THEME_STORAGE_KEY,
			nextTheme,
		);
	}, []);

	return {
		toggleTheme,
	};
}