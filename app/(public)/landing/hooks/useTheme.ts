// app/(public)/_landing/hooks/useTheme.ts

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

function getInitialTheme(): Theme {
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
		const initialTheme = getInitialTheme();

		applyTheme(initialTheme);
	}, []);

	const toggleTheme = useCallback(() => {
		const rootElement = document.documentElement;

		const currentTheme: Theme =
			rootElement.classList.contains("dark") ? "dark": "light";

		const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

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