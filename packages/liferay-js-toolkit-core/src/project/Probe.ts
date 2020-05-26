/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import Project from './Project';

export enum ProjectType {
	BUNDLER = 'liferay-npm-bundler',
	CREATE_REACT_APP = 'create-react-app',
	ANGULAR_CLI = 'angular-cli',
	VUE_CLI = 'vue-cli',
}

/**
 * Reflects project type (React, Angular, ...)
 */
export default class Probe {
	constructor(project) {
		this._project = project;
	}

	/**
	 * Return true if project is of type create-react-app
	 * @return the project type or undefined if nothing detected
	 */
	get type(): ProjectType | undefined {
		if (this._hasDependency('react-scripts')) {
			return ProjectType.CREATE_REACT_APP;
		}

		if (this._hasDependency('@angular/cli')) {
			return ProjectType.ANGULAR_CLI;
		}

		if (this._hasDependency('@vue/cli-service')) {
			return ProjectType.VUE_CLI;
		}

		// This must go last, as all other types have liferay-npm-bundler as
		// dependency
		if (this._hasDependency('liferay-npm-bundler')) {
			return ProjectType.BUNDLER;
		}

		return undefined;
	}

	_hasDependency(pkgName): boolean {
		const {pkgJson} = this._project;

		return (
			(pkgJson.dependencies &&
				pkgJson.dependencies[pkgName] !== undefined) ||
			(pkgJson.devDependencies &&
				pkgJson.devDependencies[pkgName] !== undefined)
		);
	}

	private readonly _project: Project;
}