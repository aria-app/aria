import PropTypes from 'prop-types';
import React from 'react';
import hideIf from 'react-render-helpers/hideIf';
// import showIf from 'react-render-helpers/showIf';
import styled from '@material-ui/styles/styled';
import withTheme from '@material-ui/styles/withTheme';
import shared from '../../shared';
import SongList from './SongList';

const { FadeOut, Icon, LoadingIndicator, Toolbar } = shared.components;

const DashboardCenteredContent = styled('div')(props => ({
  alignSelf: 'center',
  maxWidth: props.theme.breakpoints.values.sm,
  width: '100%',
}));

const DashboardUserImage = styled('img')({
  borderRadius: '50%',
  height: 40,
  width: 40,
});

const DashboardUserInfo = styled('div')({
  alignItems: 'center',
  display: 'flex',
  flex: '0 0 auto',
  height: '100%',
});

const Fab = styled('div')(props => ({
  alignItems: 'center',
  backgroundColor: props.theme.palette.primary.main,
  borderRadius: '50%',
  bottom: 24,
  cursor: 'pointer',
  display: 'flex',
  flex: '0 0 auto',
  height: 56,
  justifyContent: 'center',
  position: 'absolute',
  right: 24,
  width: 56,
}));

const FabIcon = withTheme(({ theme, ...rest }) => (
  <Icon color={theme.palette.primary.contrastText} {...rest} />
));

const StyledDashboard = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  position: 'relative',
});

export default class Dashboard extends React.Component {
  static propTypes = {
    isLoadingSongs: PropTypes.bool,
    onLoad: PropTypes.func,
    onSongAdd: PropTypes.func,
    onSongDelete: PropTypes.func,
    songs: PropTypes.object,
    user: PropTypes.object,
  };

  componentDidMount() {
    this.props.onLoad();

    window.document.title = 'Dashboard - Aria';
  }

  render() {
    return (
      <StyledDashboard>
        <Toolbar
          rightItems={
            <React.Fragment>
              <DashboardUserInfo>
                <DashboardUserImage
                  alt="User"
                  src={this.props.user.photoURL}
                  title={this.props.user.email}
                />
              </DashboardUserInfo>
            </React.Fragment>
          }
        />
        <FadeOut isVisible={this.props.isLoadingSongs}>
          <LoadingIndicator>LOADING SONGS...</LoadingIndicator>
        </FadeOut>
        <DashboardCenteredContent>
          {hideIf(this.props.isLoadingSongs)(() => (
            <SongList
              onDelete={this.deleteSong}
              onOpen={this.openSong}
              songs={this.props.songs}
            />
          ))}
        </DashboardCenteredContent>
        <Fab onClick={this.addSong}>
          <FabIcon icon="plus" />
        </Fab>
      </StyledDashboard>
    );
  }

  addSong = () => {
    const name = window.prompt('Enter a name for the song', 'New Song');

    if (!name) return;

    this.props.onSongAdd({
      name,
    });
  };

  deleteSong = song => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete the song "${song.name}"?`,
    );

    if (!shouldDelete) return;

    this.props.onSongDelete(song);
  };

  openSong = song => {
    this.props.history.push(`/song/${song.id}`);
  };
}
