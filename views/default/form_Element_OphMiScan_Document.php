<?php
/**
 * OpenEyes
 *
 * (C) Moorfields Eye Hospital NHS Foundation Trust, 2008-2011
 * (C) OpenEyes Foundation, 2011-2012
 * This file is part of OpenEyes.
 * OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 * OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License along with OpenEyes in a file titled COPYING. If not, see <http://www.gnu.org/licenses/>.
 *
 * @package OpenEyes
 * @link http://www.openeyes.org.uk
 * @author OpenEyes <info@openeyes.org.uk>
 * @copyright Copyright (c) 2008-2011, Moorfields Eye Hospital NHS Foundation Trust
 * @copyright Copyright (c) 2011-2012, OpenEyes Foundation
 * @license http://www.gnu.org/licenses/gpl-3.0.html The GNU General Public License V3.0
 */
?>
	<div class="element-fields">
		<?php echo $form->textField($element,'title')?>
		<?php echo $form->textArea($element,'description',array('rows'=>8,'cols'=>60))?>
	</div>

	<header class="element-header">
		<h3 class="element-title">Upload files</h3>
	</header>
	<div class="element-fields">
		<div class="row field-row">
			<div class="column large-4">
				<label for="upload_field">Select file to upload</label>
			</div>
			<div class="column large-8">
				<input class="file-upload" type="file" id="upload_field" name="upload_field" />
				<input type="submit" value="Upload" class="small" id="upload-file" />
				<div class="progress-box">
					<div class="progress-bar"></div>
				</div>
				<div class="upload-status" style="display: none;">
					Uploading 0% ...
				</div>
			</div>
		</div>
	</div>

	<header class="element-header">
		<h3 class="element-title">Available scans</h3>
	</header>

	<div class="element-fields div_scans">
		<?php $this->renderPartial('_filepicker',array(
			'mode' => 'edit',
			'identifier' => 'scans',
			'element' => $element,
			'dragsort' => true,
			'filetypes' => array(
				'application/pdf',
			),
		))?>
	</div>
