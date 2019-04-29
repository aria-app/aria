import Dawww from "dawww";
import getOr from "lodash/fp/getOr";
import isEmpty from "lodash/fp/isEmpty";
import map from "lodash/fp/map";
import range from "lodash/fp/range";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import React from "react";
import { Translation } from "react-i18next";
import styled from "styled-components/macro";
import shared from "../../../shared";

const { DropdownList, Modal } = shared.components;
// This should be moved into Dawww.
const minVolume = -20;
const maxVolume = 0;
const getVolumeRangeItem = x => ({ id: x, text: String(x) });
const volumeRangeItems = map(
  getVolumeRangeItem,
  range(maxVolume, minVolume - 1)
);

const TrackEditingModalContent = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: space-between;
  padding: ${props => props.theme.margin.m}px;
`;

const TrackEditingModalVoiceDropdown = styled.div`
  margin-bottom: ${props => props.theme.margin.l}px;
`;

export class TrackEditingModal extends React.PureComponent {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    onDismiss: PropTypes.func.isRequired,
    onVoiceSet: PropTypes.func.isRequired,
    onVolumeSet: PropTypes.func.isRequired,
    stagedTrack: PropTypes.object.isRequired
  };

  render() {
    return (
      <Translation>
        {t => (
          <Modal
            isOpen={this.getIsOpen()}
            onClickOutside={this.props.onDismiss}
            titleText={t("Edit Track")}
          >
            <TrackEditingModalContent>
              <TrackEditingModalVoiceDropdown>
                <div>{t("Voice")}</div>
                <DropdownList
                  items={getVoiceList(t)}
                  selectedId={getOr("", "props.stagedTrack.voice", this)}
                  onSelectedIdChange={
                    this.handleContentVoiceDropdownListSelectedIdChange
                  }
                />
                <div>{t("Volume")}</div>
                <DropdownList
                  items={volumeRangeItems}
                  selectedId={getOr("", "props.stagedTrack.volume", this)}
                  onSelectedIdChange={
                    this.handleContentVolumeDropdownListSelectedIdChange
                  }
                />
              </TrackEditingModalVoiceDropdown>
              <Button
                color="secondary"
                onClick={this.handleContentDeleteButtonClick}
                variant="contained"
              >
                {t("Delete")}
              </Button>
            </TrackEditingModalContent>
          </Modal>
        )}
      </Translation>
    );
  }

  getIsOpen = () => !isEmpty(this.props.stagedTrack);

  handleContentDeleteButtonClick = () => {
    this.props.onDelete(this.props.stagedTrack);
  };

  handleContentVoiceDropdownListSelectedIdChange = voice =>
    this.props.onVoiceSet(this.props.stagedTrack, voice);

  handleContentVolumeDropdownListSelectedIdChange = volume =>
    this.props.onVolumeSet(this.props.stagedTrack, volume);
}

export function getVoiceList(t) {
  return Object.keys(Dawww.VOICES).map(key => ({
    text: t(Dawww.VOICES[key]),
    id: Dawww.VOICES[key]
  }));
}
