export const schema = {
  "properties": {
    "id": "#tokensConfig",
    "properties": {
      "media": {
        "title": "Your website media queries.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType color",
          "@studioIcon material-symbols:screenshot-monitor-outline-rounded"
        ],
        "id": "#tokensConfig/media",
        "properties": {
          "xs": {
            "id": "#tokensConfig/media/xs",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/xs/value",
                "default": "(min-width: 475px)"
              }
            },
            "type": "object",
            "default": {
              "value": "(min-width: 475px)"
            }
          },
          "sm": {
            "id": "#tokensConfig/media/sm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/sm/value",
                "default": "(min-width: 640px)"
              }
            },
            "type": "object",
            "default": {
              "value": "(min-width: 640px)"
            }
          },
          "md": {
            "id": "#tokensConfig/media/md",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/md/value",
                "default": "(min-width: 768px)"
              }
            },
            "type": "object",
            "default": {
              "value": "(min-width: 768px)"
            }
          },
          "lg": {
            "id": "#tokensConfig/media/lg",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/lg/value",
                "default": "(min-width: 1024px)"
              }
            },
            "type": "object",
            "default": {
              "value": "(min-width: 1024px)"
            }
          },
          "xl": {
            "id": "#tokensConfig/media/xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/xl/value",
                "default": "(min-width: 1280px)"
              }
            },
            "type": "object",
            "default": {
              "value": "(min-width: 1280px)"
            }
          },
          "2xl": {
            "id": "#tokensConfig/media/2xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/2xl/value",
                "default": "(min-width: 1536px)"
              }
            },
            "type": "object",
            "default": {
              "value": "(min-width: 1536px)"
            }
          },
          "rm": {
            "id": "#tokensConfig/media/rm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/rm/value",
                "default": "(prefers-reduced-motion: reduce)"
              }
            },
            "type": "object",
            "default": {
              "value": "(prefers-reduced-motion: reduce)"
            }
          },
          "landscape": {
            "id": "#tokensConfig/media/landscape",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/landscape/value",
                "default": "only screen and (orientation: landscape)"
              }
            },
            "type": "object",
            "default": {
              "value": "only screen and (orientation: landscape)"
            }
          },
          "portrait": {
            "id": "#tokensConfig/media/portrait",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/media/portrait/value",
                "default": "only screen and (orientation: portrait)"
              }
            },
            "type": "object",
            "default": {
              "value": "only screen and (orientation: portrait)"
            }
          }
        },
        "type": "object",
        "default": {
          "xs": {
            "value": "(min-width: 475px)"
          },
          "sm": {
            "value": "(min-width: 640px)"
          },
          "md": {
            "value": "(min-width: 768px)"
          },
          "lg": {
            "value": "(min-width: 1024px)"
          },
          "xl": {
            "value": "(min-width: 1280px)"
          },
          "2xl": {
            "value": "(min-width: 1536px)"
          },
          "rm": {
            "value": "(prefers-reduced-motion: reduce)"
          },
          "landscape": {
            "value": "only screen and (orientation: landscape)"
          },
          "portrait": {
            "value": "only screen and (orientation: portrait)"
          }
        }
      },
      "color": {
        "title": "Your website color palette.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType color",
          "@studioIcon ph:palette"
        ],
        "id": "#tokensConfig/color",
        "properties": {
          "white": {
            "id": "#tokensConfig/color/white",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/color/white/value",
                "default": "#ffffff"
              }
            },
            "type": "object",
            "default": {
              "value": "#ffffff"
            }
          },
          "black": {
            "id": "#tokensConfig/color/black",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/color/black/value",
                "default": "#0B0A0A"
              }
            },
            "type": "object",
            "default": {
              "value": "#0B0A0A"
            }
          },
          "gray": {
            "id": "#tokensConfig/color/gray",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/gray/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/50/value",
                    "default": "#FBFBFB"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FBFBFB"
                }
              },
              "100": {
                "id": "#tokensConfig/color/gray/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/100/value",
                    "default": "#F6F5F4"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#F6F5F4"
                }
              },
              "200": {
                "id": "#tokensConfig/color/gray/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/200/value",
                    "default": "#ECEBE8"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ECEBE8"
                }
              },
              "300": {
                "id": "#tokensConfig/color/gray/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/300/value",
                    "default": "#DBD9D3"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#DBD9D3"
                }
              },
              "400": {
                "id": "#tokensConfig/color/gray/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/400/value",
                    "default": "#ADA9A4"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ADA9A4"
                }
              },
              "500": {
                "id": "#tokensConfig/color/gray/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/500/value",
                    "default": "#97948F"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#97948F"
                }
              },
              "600": {
                "id": "#tokensConfig/color/gray/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/600/value",
                    "default": "#67635D"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#67635D"
                }
              },
              "700": {
                "id": "#tokensConfig/color/gray/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/700/value",
                    "default": "#36332E"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#36332E"
                }
              },
              "800": {
                "id": "#tokensConfig/color/gray/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/800/value",
                    "default": "#201E1B"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#201E1B"
                }
              },
              "900": {
                "id": "#tokensConfig/color/gray/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/gray/900/value",
                    "default": "#121110"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#121110"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#FBFBFB"
              },
              "100": {
                "value": "#F6F5F4"
              },
              "200": {
                "value": "#ECEBE8"
              },
              "300": {
                "value": "#DBD9D3"
              },
              "400": {
                "value": "#ADA9A4"
              },
              "500": {
                "value": "#97948F"
              },
              "600": {
                "value": "#67635D"
              },
              "700": {
                "value": "#36332E"
              },
              "800": {
                "value": "#201E1B"
              },
              "900": {
                "value": "#121110"
              }
            }
          },
          "green": {
            "id": "#tokensConfig/color/green",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/green/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/50/value",
                    "default": "#ECFFF7"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ECFFF7"
                }
              },
              "100": {
                "id": "#tokensConfig/color/green/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/100/value",
                    "default": "#DEFFF1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#DEFFF1"
                }
              },
              "200": {
                "id": "#tokensConfig/color/green/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/200/value",
                    "default": "#C3FFE6"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#C3FFE6"
                }
              },
              "300": {
                "id": "#tokensConfig/color/green/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/300/value",
                    "default": "#86FBCB"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#86FBCB"
                }
              },
              "400": {
                "id": "#tokensConfig/color/green/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/400/value",
                    "default": "#3CEEA5"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#3CEEA5"
                }
              },
              "500": {
                "id": "#tokensConfig/color/green/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/500/value",
                    "default": "#0DD885"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0DD885"
                }
              },
              "600": {
                "id": "#tokensConfig/color/green/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/600/value",
                    "default": "#00B467"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#00B467"
                }
              },
              "700": {
                "id": "#tokensConfig/color/green/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/700/value",
                    "default": "#006037"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#006037"
                }
              },
              "800": {
                "id": "#tokensConfig/color/green/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/800/value",
                    "default": "#002817"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#002817"
                }
              },
              "900": {
                "id": "#tokensConfig/color/green/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/green/900/value",
                    "default": "#00190F"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#00190F"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#ECFFF7"
              },
              "100": {
                "value": "#DEFFF1"
              },
              "200": {
                "value": "#C3FFE6"
              },
              "300": {
                "value": "#86FBCB"
              },
              "400": {
                "value": "#3CEEA5"
              },
              "500": {
                "value": "#0DD885"
              },
              "600": {
                "value": "#00B467"
              },
              "700": {
                "value": "#006037"
              },
              "800": {
                "value": "#002817"
              },
              "900": {
                "value": "#00190F"
              }
            }
          },
          "yellow": {
            "id": "#tokensConfig/color/yellow",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/yellow/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/50/value",
                    "default": "#FFFCEE"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFFCEE"
                }
              },
              "100": {
                "id": "#tokensConfig/color/yellow/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/100/value",
                    "default": "#FFF6D3"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFF6D3"
                }
              },
              "200": {
                "id": "#tokensConfig/color/yellow/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/200/value",
                    "default": "#FFF0B1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFF0B1"
                }
              },
              "300": {
                "id": "#tokensConfig/color/yellow/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/300/value",
                    "default": "#FFE372"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFE372"
                }
              },
              "400": {
                "id": "#tokensConfig/color/yellow/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/400/value",
                    "default": "#FFDC4E"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFDC4E"
                }
              },
              "500": {
                "id": "#tokensConfig/color/yellow/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/500/value",
                    "default": "#FBCA05"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FBCA05"
                }
              },
              "600": {
                "id": "#tokensConfig/color/yellow/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/600/value",
                    "default": "#CBA408"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#CBA408"
                }
              },
              "700": {
                "id": "#tokensConfig/color/yellow/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/700/value",
                    "default": "#614E02"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#614E02"
                }
              },
              "800": {
                "id": "#tokensConfig/color/yellow/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/800/value",
                    "default": "#292100"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#292100"
                }
              },
              "900": {
                "id": "#tokensConfig/color/yellow/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/yellow/900/value",
                    "default": "#1B1500"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1B1500"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#FFFCEE"
              },
              "100": {
                "value": "#FFF6D3"
              },
              "200": {
                "value": "#FFF0B1"
              },
              "300": {
                "value": "#FFE372"
              },
              "400": {
                "value": "#FFDC4E"
              },
              "500": {
                "value": "#FBCA05"
              },
              "600": {
                "value": "#CBA408"
              },
              "700": {
                "value": "#614E02"
              },
              "800": {
                "value": "#292100"
              },
              "900": {
                "value": "#1B1500"
              }
            }
          },
          "orange": {
            "id": "#tokensConfig/color/orange",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/orange/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/50/value",
                    "default": "#ffe9d9"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffe9d9"
                }
              },
              "100": {
                "id": "#tokensConfig/color/orange/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/100/value",
                    "default": "#ffd3b3"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffd3b3"
                }
              },
              "200": {
                "id": "#tokensConfig/color/orange/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/200/value",
                    "default": "#ffbd8d"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffbd8d"
                }
              },
              "300": {
                "id": "#tokensConfig/color/orange/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/300/value",
                    "default": "#ffa666"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffa666"
                }
              },
              "400": {
                "id": "#tokensConfig/color/orange/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/400/value",
                    "default": "#ff9040"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff9040"
                }
              },
              "500": {
                "id": "#tokensConfig/color/orange/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/500/value",
                    "default": "#ff7a1a"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff7a1a"
                }
              },
              "600": {
                "id": "#tokensConfig/color/orange/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/600/value",
                    "default": "#e15e00"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#e15e00"
                }
              },
              "700": {
                "id": "#tokensConfig/color/orange/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/700/value",
                    "default": "#a94700"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#a94700"
                }
              },
              "800": {
                "id": "#tokensConfig/color/orange/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/800/value",
                    "default": "#702f00"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#702f00"
                }
              },
              "900": {
                "id": "#tokensConfig/color/orange/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/orange/900/value",
                    "default": "#381800"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#381800"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#ffe9d9"
              },
              "100": {
                "value": "#ffd3b3"
              },
              "200": {
                "value": "#ffbd8d"
              },
              "300": {
                "value": "#ffa666"
              },
              "400": {
                "value": "#ff9040"
              },
              "500": {
                "value": "#ff7a1a"
              },
              "600": {
                "value": "#e15e00"
              },
              "700": {
                "value": "#a94700"
              },
              "800": {
                "value": "#702f00"
              },
              "900": {
                "value": "#381800"
              }
            }
          },
          "red": {
            "id": "#tokensConfig/color/red",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/red/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/50/value",
                    "default": "#FFF9F8"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFF9F8"
                }
              },
              "100": {
                "id": "#tokensConfig/color/red/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/100/value",
                    "default": "#FFF3F0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFF3F0"
                }
              },
              "200": {
                "id": "#tokensConfig/color/red/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/200/value",
                    "default": "#FFDED7"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFDED7"
                }
              },
              "300": {
                "id": "#tokensConfig/color/red/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/300/value",
                    "default": "#FFA692"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FFA692"
                }
              },
              "400": {
                "id": "#tokensConfig/color/red/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/400/value",
                    "default": "#FF7353"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FF7353"
                }
              },
              "500": {
                "id": "#tokensConfig/color/red/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/500/value",
                    "default": "#FF3B10"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#FF3B10"
                }
              },
              "600": {
                "id": "#tokensConfig/color/red/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/600/value",
                    "default": "#BB2402"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#BB2402"
                }
              },
              "700": {
                "id": "#tokensConfig/color/red/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/700/value",
                    "default": "#701704"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#701704"
                }
              },
              "800": {
                "id": "#tokensConfig/color/red/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/800/value",
                    "default": "#340A01"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#340A01"
                }
              },
              "900": {
                "id": "#tokensConfig/color/red/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/red/900/value",
                    "default": "#1C0301"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1C0301"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#FFF9F8"
              },
              "100": {
                "value": "#FFF3F0"
              },
              "200": {
                "value": "#FFDED7"
              },
              "300": {
                "value": "#FFA692"
              },
              "400": {
                "value": "#FF7353"
              },
              "500": {
                "value": "#FF3B10"
              },
              "600": {
                "value": "#BB2402"
              },
              "700": {
                "value": "#701704"
              },
              "800": {
                "value": "#340A01"
              },
              "900": {
                "value": "#1C0301"
              }
            }
          },
          "pear": {
            "id": "#tokensConfig/color/pear",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/pear/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/50/value",
                    "default": "#f7f8dc"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#f7f8dc"
                }
              },
              "100": {
                "id": "#tokensConfig/color/pear/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/100/value",
                    "default": "#eff0ba"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#eff0ba"
                }
              },
              "200": {
                "id": "#tokensConfig/color/pear/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/200/value",
                    "default": "#e8e997"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#e8e997"
                }
              },
              "300": {
                "id": "#tokensConfig/color/pear/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/300/value",
                    "default": "#e0e274"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#e0e274"
                }
              },
              "400": {
                "id": "#tokensConfig/color/pear/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/400/value",
                    "default": "#d8da52"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#d8da52"
                }
              },
              "500": {
                "id": "#tokensConfig/color/pear/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/500/value",
                    "default": "#d0d32f"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#d0d32f"
                }
              },
              "600": {
                "id": "#tokensConfig/color/pear/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/600/value",
                    "default": "#a8aa24"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#a8aa24"
                }
              },
              "700": {
                "id": "#tokensConfig/color/pear/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/700/value",
                    "default": "#7e801b"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#7e801b"
                }
              },
              "800": {
                "id": "#tokensConfig/color/pear/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/800/value",
                    "default": "#545512"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#545512"
                }
              },
              "900": {
                "id": "#tokensConfig/color/pear/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pear/900/value",
                    "default": "#2a2b09"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#2a2b09"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#f7f8dc"
              },
              "100": {
                "value": "#eff0ba"
              },
              "200": {
                "value": "#e8e997"
              },
              "300": {
                "value": "#e0e274"
              },
              "400": {
                "value": "#d8da52"
              },
              "500": {
                "value": "#d0d32f"
              },
              "600": {
                "value": "#a8aa24"
              },
              "700": {
                "value": "#7e801b"
              },
              "800": {
                "value": "#545512"
              },
              "900": {
                "value": "#2a2b09"
              }
            }
          },
          "teal": {
            "id": "#tokensConfig/color/teal",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/teal/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/50/value",
                    "default": "#d7faf8"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#d7faf8"
                }
              },
              "100": {
                "id": "#tokensConfig/color/teal/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/100/value",
                    "default": "#aff4f0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#aff4f0"
                }
              },
              "200": {
                "id": "#tokensConfig/color/teal/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/200/value",
                    "default": "#87efe9"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#87efe9"
                }
              },
              "300": {
                "id": "#tokensConfig/color/teal/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/300/value",
                    "default": "#5fe9e1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#5fe9e1"
                }
              },
              "400": {
                "id": "#tokensConfig/color/teal/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/400/value",
                    "default": "#36e4da"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#36e4da"
                }
              },
              "500": {
                "id": "#tokensConfig/color/teal/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/500/value",
                    "default": "#1cd1c6"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1cd1c6"
                }
              },
              "600": {
                "id": "#tokensConfig/color/teal/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/600/value",
                    "default": "#16a79e"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#16a79e"
                }
              },
              "700": {
                "id": "#tokensConfig/color/teal/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/700/value",
                    "default": "#117d77"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#117d77"
                }
              },
              "800": {
                "id": "#tokensConfig/color/teal/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/800/value",
                    "default": "#0b544f"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0b544f"
                }
              },
              "900": {
                "id": "#tokensConfig/color/teal/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/teal/900/value",
                    "default": "#062a28"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#062a28"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#d7faf8"
              },
              "100": {
                "value": "#aff4f0"
              },
              "200": {
                "value": "#87efe9"
              },
              "300": {
                "value": "#5fe9e1"
              },
              "400": {
                "value": "#36e4da"
              },
              "500": {
                "value": "#1cd1c6"
              },
              "600": {
                "value": "#16a79e"
              },
              "700": {
                "value": "#117d77"
              },
              "800": {
                "value": "#0b544f"
              },
              "900": {
                "value": "#062a28"
              }
            }
          },
          "lightblue": {
            "id": "#tokensConfig/color/lightblue",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/lightblue/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/50/value",
                    "default": "#d9f8ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#d9f8ff"
                }
              },
              "100": {
                "id": "#tokensConfig/color/lightblue/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/100/value",
                    "default": "#b3f1ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#b3f1ff"
                }
              },
              "200": {
                "id": "#tokensConfig/color/lightblue/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/200/value",
                    "default": "#8deaff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#8deaff"
                }
              },
              "300": {
                "id": "#tokensConfig/color/lightblue/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/300/value",
                    "default": "#66e4ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#66e4ff"
                }
              },
              "400": {
                "id": "#tokensConfig/color/lightblue/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/400/value",
                    "default": "#40ddff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#40ddff"
                }
              },
              "500": {
                "id": "#tokensConfig/color/lightblue/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/500/value",
                    "default": "#1ad6ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1ad6ff"
                }
              },
              "600": {
                "id": "#tokensConfig/color/lightblue/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/600/value",
                    "default": "#00b9e1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#00b9e1"
                }
              },
              "700": {
                "id": "#tokensConfig/color/lightblue/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/700/value",
                    "default": "#008aa9"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#008aa9"
                }
              },
              "800": {
                "id": "#tokensConfig/color/lightblue/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/800/value",
                    "default": "#005c70"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#005c70"
                }
              },
              "900": {
                "id": "#tokensConfig/color/lightblue/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/lightblue/900/value",
                    "default": "#002e38"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#002e38"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#d9f8ff"
              },
              "100": {
                "value": "#b3f1ff"
              },
              "200": {
                "value": "#8deaff"
              },
              "300": {
                "value": "#66e4ff"
              },
              "400": {
                "value": "#40ddff"
              },
              "500": {
                "value": "#1ad6ff"
              },
              "600": {
                "value": "#00b9e1"
              },
              "700": {
                "value": "#008aa9"
              },
              "800": {
                "value": "#005c70"
              },
              "900": {
                "value": "#002e38"
              }
            }
          },
          "blue": {
            "id": "#tokensConfig/color/blue",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/blue/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/50/value",
                    "default": "#F2FAFF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#F2FAFF"
                }
              },
              "100": {
                "id": "#tokensConfig/color/blue/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/100/value",
                    "default": "#DFF3FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#DFF3FF"
                }
              },
              "200": {
                "id": "#tokensConfig/color/blue/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/200/value",
                    "default": "#C6EAFF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#C6EAFF"
                }
              },
              "300": {
                "id": "#tokensConfig/color/blue/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/300/value",
                    "default": "#A1DDFF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#A1DDFF"
                }
              },
              "400": {
                "id": "#tokensConfig/color/blue/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/400/value",
                    "default": "#64C7FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#64C7FF"
                }
              },
              "500": {
                "id": "#tokensConfig/color/blue/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/500/value",
                    "default": "#1AADFF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1AADFF"
                }
              },
              "600": {
                "id": "#tokensConfig/color/blue/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/600/value",
                    "default": "#0069A6"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0069A6"
                }
              },
              "700": {
                "id": "#tokensConfig/color/blue/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/700/value",
                    "default": "#014267"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#014267"
                }
              },
              "800": {
                "id": "#tokensConfig/color/blue/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/800/value",
                    "default": "#002235"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#002235"
                }
              },
              "900": {
                "id": "#tokensConfig/color/blue/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/blue/900/value",
                    "default": "#00131D"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#00131D"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#F2FAFF"
              },
              "100": {
                "value": "#DFF3FF"
              },
              "200": {
                "value": "#C6EAFF"
              },
              "300": {
                "value": "#A1DDFF"
              },
              "400": {
                "value": "#64C7FF"
              },
              "500": {
                "value": "#1AADFF"
              },
              "600": {
                "value": "#0069A6"
              },
              "700": {
                "value": "#014267"
              },
              "800": {
                "value": "#002235"
              },
              "900": {
                "value": "#00131D"
              }
            }
          },
          "indigoblue": {
            "id": "#tokensConfig/color/indigoblue",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/indigoblue/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/50/value",
                    "default": "#d9e5ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#d9e5ff"
                }
              },
              "100": {
                "id": "#tokensConfig/color/indigoblue/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/100/value",
                    "default": "#b3cbff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#b3cbff"
                }
              },
              "200": {
                "id": "#tokensConfig/color/indigoblue/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/200/value",
                    "default": "#8db0ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#8db0ff"
                }
              },
              "300": {
                "id": "#tokensConfig/color/indigoblue/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/300/value",
                    "default": "#6696ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#6696ff"
                }
              },
              "400": {
                "id": "#tokensConfig/color/indigoblue/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/400/value",
                    "default": "#407cff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#407cff"
                }
              },
              "500": {
                "id": "#tokensConfig/color/indigoblue/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/500/value",
                    "default": "#1a62ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1a62ff"
                }
              },
              "600": {
                "id": "#tokensConfig/color/indigoblue/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/600/value",
                    "default": "#0047e1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0047e1"
                }
              },
              "700": {
                "id": "#tokensConfig/color/indigoblue/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/700/value",
                    "default": "#0035a9"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0035a9"
                }
              },
              "800": {
                "id": "#tokensConfig/color/indigoblue/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/800/value",
                    "default": "#002370"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#002370"
                }
              },
              "900": {
                "id": "#tokensConfig/color/indigoblue/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/indigoblue/900/value",
                    "default": "#001238"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#001238"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#d9e5ff"
              },
              "100": {
                "value": "#b3cbff"
              },
              "200": {
                "value": "#8db0ff"
              },
              "300": {
                "value": "#6696ff"
              },
              "400": {
                "value": "#407cff"
              },
              "500": {
                "value": "#1a62ff"
              },
              "600": {
                "value": "#0047e1"
              },
              "700": {
                "value": "#0035a9"
              },
              "800": {
                "value": "#002370"
              },
              "900": {
                "value": "#001238"
              }
            }
          },
          "royalblue": {
            "id": "#tokensConfig/color/royalblue",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/royalblue/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/50/value",
                    "default": "#dfdbfb"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#dfdbfb"
                }
              },
              "100": {
                "id": "#tokensConfig/color/royalblue/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/100/value",
                    "default": "#c0b7f7"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#c0b7f7"
                }
              },
              "200": {
                "id": "#tokensConfig/color/royalblue/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/200/value",
                    "default": "#a093f3"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#a093f3"
                }
              },
              "300": {
                "id": "#tokensConfig/color/royalblue/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/300/value",
                    "default": "#806ff0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#806ff0"
                }
              },
              "400": {
                "id": "#tokensConfig/color/royalblue/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/400/value",
                    "default": "#614bec"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#614bec"
                }
              },
              "500": {
                "id": "#tokensConfig/color/royalblue/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/500/value",
                    "default": "#4127e8"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#4127e8"
                }
              },
              "600": {
                "id": "#tokensConfig/color/royalblue/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/600/value",
                    "default": "#2c15c4"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#2c15c4"
                }
              },
              "700": {
                "id": "#tokensConfig/color/royalblue/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/700/value",
                    "default": "#211093"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#211093"
                }
              },
              "800": {
                "id": "#tokensConfig/color/royalblue/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/800/value",
                    "default": "#160a62"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#160a62"
                }
              },
              "900": {
                "id": "#tokensConfig/color/royalblue/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/royalblue/900/value",
                    "default": "#0b0531"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0b0531"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#dfdbfb"
              },
              "100": {
                "value": "#c0b7f7"
              },
              "200": {
                "value": "#a093f3"
              },
              "300": {
                "value": "#806ff0"
              },
              "400": {
                "value": "#614bec"
              },
              "500": {
                "value": "#4127e8"
              },
              "600": {
                "value": "#2c15c4"
              },
              "700": {
                "value": "#211093"
              },
              "800": {
                "value": "#160a62"
              },
              "900": {
                "value": "#0b0531"
              }
            }
          },
          "purple": {
            "id": "#tokensConfig/color/purple",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/purple/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/50/value",
                    "default": "#ead9ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ead9ff"
                }
              },
              "100": {
                "id": "#tokensConfig/color/purple/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/100/value",
                    "default": "#d5b3ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#d5b3ff"
                }
              },
              "200": {
                "id": "#tokensConfig/color/purple/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/200/value",
                    "default": "#c08dff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#c08dff"
                }
              },
              "300": {
                "id": "#tokensConfig/color/purple/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/300/value",
                    "default": "#ab66ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ab66ff"
                }
              },
              "400": {
                "id": "#tokensConfig/color/purple/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/400/value",
                    "default": "#9640ff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#9640ff"
                }
              },
              "500": {
                "id": "#tokensConfig/color/purple/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/500/value",
                    "default": "#811aff"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#811aff"
                }
              },
              "600": {
                "id": "#tokensConfig/color/purple/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/600/value",
                    "default": "#6500e1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#6500e1"
                }
              },
              "700": {
                "id": "#tokensConfig/color/purple/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/700/value",
                    "default": "#4c00a9"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#4c00a9"
                }
              },
              "800": {
                "id": "#tokensConfig/color/purple/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/800/value",
                    "default": "#330070"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#330070"
                }
              },
              "900": {
                "id": "#tokensConfig/color/purple/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/purple/900/value",
                    "default": "#190038"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#190038"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#ead9ff"
              },
              "100": {
                "value": "#d5b3ff"
              },
              "200": {
                "value": "#c08dff"
              },
              "300": {
                "value": "#ab66ff"
              },
              "400": {
                "value": "#9640ff"
              },
              "500": {
                "value": "#811aff"
              },
              "600": {
                "value": "#6500e1"
              },
              "700": {
                "value": "#4c00a9"
              },
              "800": {
                "value": "#330070"
              },
              "900": {
                "value": "#190038"
              }
            }
          },
          "pink": {
            "id": "#tokensConfig/color/pink",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/pink/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/50/value",
                    "default": "#ffd9f2"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffd9f2"
                }
              },
              "100": {
                "id": "#tokensConfig/color/pink/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/100/value",
                    "default": "#ffb3e5"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffb3e5"
                }
              },
              "200": {
                "id": "#tokensConfig/color/pink/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/200/value",
                    "default": "#ff8dd8"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff8dd8"
                }
              },
              "300": {
                "id": "#tokensConfig/color/pink/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/300/value",
                    "default": "#ff66cc"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff66cc"
                }
              },
              "400": {
                "id": "#tokensConfig/color/pink/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/400/value",
                    "default": "#ff40bf"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff40bf"
                }
              },
              "500": {
                "id": "#tokensConfig/color/pink/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/500/value",
                    "default": "#ff1ab2"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff1ab2"
                }
              },
              "600": {
                "id": "#tokensConfig/color/pink/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/600/value",
                    "default": "#e10095"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#e10095"
                }
              },
              "700": {
                "id": "#tokensConfig/color/pink/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/700/value",
                    "default": "#a90070"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#a90070"
                }
              },
              "800": {
                "id": "#tokensConfig/color/pink/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/800/value",
                    "default": "#70004b"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#70004b"
                }
              },
              "900": {
                "id": "#tokensConfig/color/pink/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/pink/900/value",
                    "default": "#380025"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#380025"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#ffd9f2"
              },
              "100": {
                "value": "#ffb3e5"
              },
              "200": {
                "value": "#ff8dd8"
              },
              "300": {
                "value": "#ff66cc"
              },
              "400": {
                "value": "#ff40bf"
              },
              "500": {
                "value": "#ff1ab2"
              },
              "600": {
                "value": "#e10095"
              },
              "700": {
                "value": "#a90070"
              },
              "800": {
                "value": "#70004b"
              },
              "900": {
                "value": "#380025"
              }
            }
          },
          "ruby": {
            "id": "#tokensConfig/color/ruby",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/ruby/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/50/value",
                    "default": "#ffd9e4"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffd9e4"
                }
              },
              "100": {
                "id": "#tokensConfig/color/ruby/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/100/value",
                    "default": "#ffb3c9"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ffb3c9"
                }
              },
              "200": {
                "id": "#tokensConfig/color/ruby/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/200/value",
                    "default": "#ff8dae"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff8dae"
                }
              },
              "300": {
                "id": "#tokensConfig/color/ruby/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/300/value",
                    "default": "#ff6694"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff6694"
                }
              },
              "400": {
                "id": "#tokensConfig/color/ruby/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/400/value",
                    "default": "#ff4079"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff4079"
                }
              },
              "500": {
                "id": "#tokensConfig/color/ruby/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/500/value",
                    "default": "#ff1a5e"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#ff1a5e"
                }
              },
              "600": {
                "id": "#tokensConfig/color/ruby/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/600/value",
                    "default": "#e10043"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#e10043"
                }
              },
              "700": {
                "id": "#tokensConfig/color/ruby/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/700/value",
                    "default": "#a90032"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#a90032"
                }
              },
              "800": {
                "id": "#tokensConfig/color/ruby/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/800/value",
                    "default": "#700021"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#700021"
                }
              },
              "900": {
                "id": "#tokensConfig/color/ruby/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/ruby/900/value",
                    "default": "#380011"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#380011"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#ffd9e4"
              },
              "100": {
                "value": "#ffb3c9"
              },
              "200": {
                "value": "#ff8dae"
              },
              "300": {
                "value": "#ff6694"
              },
              "400": {
                "value": "#ff4079"
              },
              "500": {
                "value": "#ff1a5e"
              },
              "600": {
                "value": "#e10043"
              },
              "700": {
                "value": "#a90032"
              },
              "800": {
                "value": "#700021"
              },
              "900": {
                "value": "#380011"
              }
            }
          },
          "primary": {
            "id": "#tokensConfig/color/primary",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/primary/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/50/value",
                    "default": "#F1FCFF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#F1FCFF"
                }
              },
              "100": {
                "id": "#tokensConfig/color/primary/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/100/value",
                    "default": "#DCF7FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#DCF7FF"
                }
              },
              "200": {
                "id": "#tokensConfig/color/primary/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/200/value",
                    "default": "#C5F2FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#C5F2FF"
                }
              },
              "300": {
                "id": "#tokensConfig/color/primary/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/300/value",
                    "default": "#82E3FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#82E3FF"
                }
              },
              "400": {
                "id": "#tokensConfig/color/primary/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/400/value",
                    "default": "#55E1FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#55E1FF"
                }
              },
              "500": {
                "id": "#tokensConfig/color/primary/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/500/value",
                    "default": "#1AD6FF"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#1AD6FF"
                }
              },
              "600": {
                "id": "#tokensConfig/color/primary/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/600/value",
                    "default": "#09A0C1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#09A0C1"
                }
              },
              "700": {
                "id": "#tokensConfig/color/primary/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/700/value",
                    "default": "#024757"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#024757"
                }
              },
              "800": {
                "id": "#tokensConfig/color/primary/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/800/value",
                    "default": "#00232B"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#00232B"
                }
              },
              "900": {
                "id": "#tokensConfig/color/primary/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/primary/900/value",
                    "default": "#001A1F"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#001A1F"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "#F1FCFF"
              },
              "100": {
                "value": "#DCF7FF"
              },
              "200": {
                "value": "#C5F2FF"
              },
              "300": {
                "value": "#82E3FF"
              },
              "400": {
                "value": "#55E1FF"
              },
              "500": {
                "value": "#1AD6FF"
              },
              "600": {
                "value": "#09A0C1"
              },
              "700": {
                "value": "#024757"
              },
              "800": {
                "value": "#00232B"
              },
              "900": {
                "value": "#001A1F"
              }
            }
          },
          "secondary": {
            "id": "#tokensConfig/color/secondary",
            "properties": {
              "50": {
                "id": "#tokensConfig/color/secondary/50",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/50/value",
                    "default": "{color.gray.50}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.50}"
                }
              },
              "100": {
                "id": "#tokensConfig/color/secondary/100",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/100/value",
                    "default": "{color.gray.100}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.100}"
                }
              },
              "200": {
                "id": "#tokensConfig/color/secondary/200",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/200/value",
                    "default": "{color.gray.200}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.200}"
                }
              },
              "300": {
                "id": "#tokensConfig/color/secondary/300",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/300/value",
                    "default": "{color.gray.300}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.300}"
                }
              },
              "400": {
                "id": "#tokensConfig/color/secondary/400",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/400/value",
                    "default": "{color.gray.400}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.400}"
                }
              },
              "500": {
                "id": "#tokensConfig/color/secondary/500",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/500/value",
                    "default": "{color.gray.500}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.500}"
                }
              },
              "600": {
                "id": "#tokensConfig/color/secondary/600",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/600/value",
                    "default": "{color.gray.600}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.600}"
                }
              },
              "700": {
                "id": "#tokensConfig/color/secondary/700",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/700/value",
                    "default": "{color.gray.700}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.700}"
                }
              },
              "800": {
                "id": "#tokensConfig/color/secondary/800",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/800/value",
                    "default": "{color.gray.800}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.800}"
                }
              },
              "900": {
                "id": "#tokensConfig/color/secondary/900",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/color/secondary/900/value",
                    "default": "{color.gray.900}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{color.gray.900}"
                }
              }
            },
            "type": "object",
            "default": {
              "50": {
                "value": "{color.gray.50}"
              },
              "100": {
                "value": "{color.gray.100}"
              },
              "200": {
                "value": "{color.gray.200}"
              },
              "300": {
                "value": "{color.gray.300}"
              },
              "400": {
                "value": "{color.gray.400}"
              },
              "500": {
                "value": "{color.gray.500}"
              },
              "600": {
                "value": "{color.gray.600}"
              },
              "700": {
                "value": "{color.gray.700}"
              },
              "800": {
                "value": "{color.gray.800}"
              },
              "900": {
                "value": "{color.gray.900}"
              }
            }
          },
          "shadow": {
            "id": "#tokensConfig/color/shadow",
            "properties": {
              "value": {
                "id": "#tokensConfig/color/shadow/value",
                "properties": {
                  "initial": {
                    "type": "string",
                    "id": "#tokensConfig/color/shadow/value/initial",
                    "default": "{color.gray.400}"
                  },
                  "dark": {
                    "type": "string",
                    "id": "#tokensConfig/color/shadow/value/dark",
                    "default": "{color.gray.800}"
                  }
                },
                "type": "object",
                "default": {
                  "initial": "{color.gray.400}",
                  "dark": "{color.gray.800}"
                }
              }
            },
            "type": "object",
            "default": {
              "value": {
                "initial": "{color.gray.400}",
                "dark": "{color.gray.800}"
              }
            }
          }
        },
        "type": "object",
        "default": {
          "white": {
            "value": "#ffffff"
          },
          "black": {
            "value": "#0B0A0A"
          },
          "gray": {
            "50": {
              "value": "#FBFBFB"
            },
            "100": {
              "value": "#F6F5F4"
            },
            "200": {
              "value": "#ECEBE8"
            },
            "300": {
              "value": "#DBD9D3"
            },
            "400": {
              "value": "#ADA9A4"
            },
            "500": {
              "value": "#97948F"
            },
            "600": {
              "value": "#67635D"
            },
            "700": {
              "value": "#36332E"
            },
            "800": {
              "value": "#201E1B"
            },
            "900": {
              "value": "#121110"
            }
          },
          "green": {
            "50": {
              "value": "#ECFFF7"
            },
            "100": {
              "value": "#DEFFF1"
            },
            "200": {
              "value": "#C3FFE6"
            },
            "300": {
              "value": "#86FBCB"
            },
            "400": {
              "value": "#3CEEA5"
            },
            "500": {
              "value": "#0DD885"
            },
            "600": {
              "value": "#00B467"
            },
            "700": {
              "value": "#006037"
            },
            "800": {
              "value": "#002817"
            },
            "900": {
              "value": "#00190F"
            }
          },
          "yellow": {
            "50": {
              "value": "#FFFCEE"
            },
            "100": {
              "value": "#FFF6D3"
            },
            "200": {
              "value": "#FFF0B1"
            },
            "300": {
              "value": "#FFE372"
            },
            "400": {
              "value": "#FFDC4E"
            },
            "500": {
              "value": "#FBCA05"
            },
            "600": {
              "value": "#CBA408"
            },
            "700": {
              "value": "#614E02"
            },
            "800": {
              "value": "#292100"
            },
            "900": {
              "value": "#1B1500"
            }
          },
          "orange": {
            "50": {
              "value": "#ffe9d9"
            },
            "100": {
              "value": "#ffd3b3"
            },
            "200": {
              "value": "#ffbd8d"
            },
            "300": {
              "value": "#ffa666"
            },
            "400": {
              "value": "#ff9040"
            },
            "500": {
              "value": "#ff7a1a"
            },
            "600": {
              "value": "#e15e00"
            },
            "700": {
              "value": "#a94700"
            },
            "800": {
              "value": "#702f00"
            },
            "900": {
              "value": "#381800"
            }
          },
          "red": {
            "50": {
              "value": "#FFF9F8"
            },
            "100": {
              "value": "#FFF3F0"
            },
            "200": {
              "value": "#FFDED7"
            },
            "300": {
              "value": "#FFA692"
            },
            "400": {
              "value": "#FF7353"
            },
            "500": {
              "value": "#FF3B10"
            },
            "600": {
              "value": "#BB2402"
            },
            "700": {
              "value": "#701704"
            },
            "800": {
              "value": "#340A01"
            },
            "900": {
              "value": "#1C0301"
            }
          },
          "pear": {
            "50": {
              "value": "#f7f8dc"
            },
            "100": {
              "value": "#eff0ba"
            },
            "200": {
              "value": "#e8e997"
            },
            "300": {
              "value": "#e0e274"
            },
            "400": {
              "value": "#d8da52"
            },
            "500": {
              "value": "#d0d32f"
            },
            "600": {
              "value": "#a8aa24"
            },
            "700": {
              "value": "#7e801b"
            },
            "800": {
              "value": "#545512"
            },
            "900": {
              "value": "#2a2b09"
            }
          },
          "teal": {
            "50": {
              "value": "#d7faf8"
            },
            "100": {
              "value": "#aff4f0"
            },
            "200": {
              "value": "#87efe9"
            },
            "300": {
              "value": "#5fe9e1"
            },
            "400": {
              "value": "#36e4da"
            },
            "500": {
              "value": "#1cd1c6"
            },
            "600": {
              "value": "#16a79e"
            },
            "700": {
              "value": "#117d77"
            },
            "800": {
              "value": "#0b544f"
            },
            "900": {
              "value": "#062a28"
            }
          },
          "lightblue": {
            "50": {
              "value": "#d9f8ff"
            },
            "100": {
              "value": "#b3f1ff"
            },
            "200": {
              "value": "#8deaff"
            },
            "300": {
              "value": "#66e4ff"
            },
            "400": {
              "value": "#40ddff"
            },
            "500": {
              "value": "#1ad6ff"
            },
            "600": {
              "value": "#00b9e1"
            },
            "700": {
              "value": "#008aa9"
            },
            "800": {
              "value": "#005c70"
            },
            "900": {
              "value": "#002e38"
            }
          },
          "blue": {
            "50": {
              "value": "#F2FAFF"
            },
            "100": {
              "value": "#DFF3FF"
            },
            "200": {
              "value": "#C6EAFF"
            },
            "300": {
              "value": "#A1DDFF"
            },
            "400": {
              "value": "#64C7FF"
            },
            "500": {
              "value": "#1AADFF"
            },
            "600": {
              "value": "#0069A6"
            },
            "700": {
              "value": "#014267"
            },
            "800": {
              "value": "#002235"
            },
            "900": {
              "value": "#00131D"
            }
          },
          "indigoblue": {
            "50": {
              "value": "#d9e5ff"
            },
            "100": {
              "value": "#b3cbff"
            },
            "200": {
              "value": "#8db0ff"
            },
            "300": {
              "value": "#6696ff"
            },
            "400": {
              "value": "#407cff"
            },
            "500": {
              "value": "#1a62ff"
            },
            "600": {
              "value": "#0047e1"
            },
            "700": {
              "value": "#0035a9"
            },
            "800": {
              "value": "#002370"
            },
            "900": {
              "value": "#001238"
            }
          },
          "royalblue": {
            "50": {
              "value": "#dfdbfb"
            },
            "100": {
              "value": "#c0b7f7"
            },
            "200": {
              "value": "#a093f3"
            },
            "300": {
              "value": "#806ff0"
            },
            "400": {
              "value": "#614bec"
            },
            "500": {
              "value": "#4127e8"
            },
            "600": {
              "value": "#2c15c4"
            },
            "700": {
              "value": "#211093"
            },
            "800": {
              "value": "#160a62"
            },
            "900": {
              "value": "#0b0531"
            }
          },
          "purple": {
            "50": {
              "value": "#ead9ff"
            },
            "100": {
              "value": "#d5b3ff"
            },
            "200": {
              "value": "#c08dff"
            },
            "300": {
              "value": "#ab66ff"
            },
            "400": {
              "value": "#9640ff"
            },
            "500": {
              "value": "#811aff"
            },
            "600": {
              "value": "#6500e1"
            },
            "700": {
              "value": "#4c00a9"
            },
            "800": {
              "value": "#330070"
            },
            "900": {
              "value": "#190038"
            }
          },
          "pink": {
            "50": {
              "value": "#ffd9f2"
            },
            "100": {
              "value": "#ffb3e5"
            },
            "200": {
              "value": "#ff8dd8"
            },
            "300": {
              "value": "#ff66cc"
            },
            "400": {
              "value": "#ff40bf"
            },
            "500": {
              "value": "#ff1ab2"
            },
            "600": {
              "value": "#e10095"
            },
            "700": {
              "value": "#a90070"
            },
            "800": {
              "value": "#70004b"
            },
            "900": {
              "value": "#380025"
            }
          },
          "ruby": {
            "50": {
              "value": "#ffd9e4"
            },
            "100": {
              "value": "#ffb3c9"
            },
            "200": {
              "value": "#ff8dae"
            },
            "300": {
              "value": "#ff6694"
            },
            "400": {
              "value": "#ff4079"
            },
            "500": {
              "value": "#ff1a5e"
            },
            "600": {
              "value": "#e10043"
            },
            "700": {
              "value": "#a90032"
            },
            "800": {
              "value": "#700021"
            },
            "900": {
              "value": "#380011"
            }
          },
          "primary": {
            "50": {
              "value": "#F1FCFF"
            },
            "100": {
              "value": "#DCF7FF"
            },
            "200": {
              "value": "#C5F2FF"
            },
            "300": {
              "value": "#82E3FF"
            },
            "400": {
              "value": "#55E1FF"
            },
            "500": {
              "value": "#1AD6FF"
            },
            "600": {
              "value": "#09A0C1"
            },
            "700": {
              "value": "#024757"
            },
            "800": {
              "value": "#00232B"
            },
            "900": {
              "value": "#001A1F"
            }
          },
          "secondary": {
            "50": {
              "value": "{color.gray.50}"
            },
            "100": {
              "value": "{color.gray.100}"
            },
            "200": {
              "value": "{color.gray.200}"
            },
            "300": {
              "value": "{color.gray.300}"
            },
            "400": {
              "value": "{color.gray.400}"
            },
            "500": {
              "value": "{color.gray.500}"
            },
            "600": {
              "value": "{color.gray.600}"
            },
            "700": {
              "value": "{color.gray.700}"
            },
            "800": {
              "value": "{color.gray.800}"
            },
            "900": {
              "value": "{color.gray.900}"
            }
          },
          "shadow": {
            "value": {
              "initial": "{color.gray.400}",
              "dark": "{color.gray.800}"
            }
          }
        }
      },
      "width": {
        "title": "Your website screen sizings.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon ph:ruler"
        ],
        "id": "#tokensConfig/width",
        "properties": {
          "screen": {
            "id": "#tokensConfig/width/screen",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/width/screen/value",
                "default": "100vw"
              }
            },
            "type": "object",
            "default": {
              "value": "100vw"
            }
          }
        },
        "type": "object",
        "default": {
          "screen": {
            "value": "100vw"
          }
        }
      },
      "height": {
        "title": "Your website screen sizings.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon ph:ruler"
        ],
        "id": "#tokensConfig/height",
        "properties": {
          "screen": {
            "id": "#tokensConfig/height/screen",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/height/screen/value",
                "default": "100vh"
              }
            },
            "type": "object",
            "default": {
              "value": "100vh"
            }
          }
        },
        "type": "object",
        "default": {
          "screen": {
            "value": "100vh"
          }
        }
      },
      "shadow": {
        "title": "Your website shadows.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType shadow",
          "@studioIcon mdi:box-shadow"
        ],
        "id": "#tokensConfig/shadow",
        "properties": {
          "xs": {
            "id": "#tokensConfig/shadow/xs",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/xs/value",
                "default": "0px 1px 2px 0px {color.shadow}"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 1px 2px 0px {color.shadow}"
            }
          },
          "sm": {
            "id": "#tokensConfig/shadow/sm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/sm/value",
                "default": "0px 1px 3px 0px {color.shadow}, 0px 1px 2px -1px {color.shadow}"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 1px 3px 0px {color.shadow}, 0px 1px 2px -1px {color.shadow}"
            }
          },
          "md": {
            "id": "#tokensConfig/shadow/md",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/md/value",
                "default": "0px 4px 6px -1px {color.shadow}, 0px 2px 4px -2px {color.shadow}"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 4px 6px -1px {color.shadow}, 0px 2px 4px -2px {color.shadow}"
            }
          },
          "lg": {
            "id": "#tokensConfig/shadow/lg",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/lg/value",
                "default": "0px 10px 15px -3px {color.shadow}, 0px 4px 6px -4px {color.shadow}"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 10px 15px -3px {color.shadow}, 0px 4px 6px -4px {color.shadow}"
            }
          },
          "xl": {
            "id": "#tokensConfig/shadow/xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/xl/value",
                "default": "0px 20px 25px -5px {color.shadow}, 0px 8px 10px -6px {color.shadow}"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 20px 25px -5px {color.shadow}, 0px 8px 10px -6px {color.shadow}"
            }
          },
          "2xl": {
            "id": "#tokensConfig/shadow/2xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/2xl/value",
                "default": "0px 25px 50px -12px {color.shadow}"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 25px 50px -12px {color.shadow}"
            }
          },
          "none": {
            "id": "#tokensConfig/shadow/none",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/shadow/none/value",
                "default": "0px 0px 0px 0px transparent"
              }
            },
            "type": "object",
            "default": {
              "value": "0px 0px 0px 0px transparent"
            }
          }
        },
        "type": "object",
        "default": {
          "xs": {
            "value": "0px 1px 2px 0px {color.shadow}"
          },
          "sm": {
            "value": "0px 1px 3px 0px {color.shadow}, 0px 1px 2px -1px {color.shadow}"
          },
          "md": {
            "value": "0px 4px 6px -1px {color.shadow}, 0px 2px 4px -2px {color.shadow}"
          },
          "lg": {
            "value": "0px 10px 15px -3px {color.shadow}, 0px 4px 6px -4px {color.shadow}"
          },
          "xl": {
            "value": "0px 20px 25px -5px {color.shadow}, 0px 8px 10px -6px {color.shadow}"
          },
          "2xl": {
            "value": "0px 25px 50px -12px {color.shadow}"
          },
          "none": {
            "value": "0px 0px 0px 0px transparent"
          }
        }
      },
      "radii": {
        "title": "Your website border radiuses.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon material-symbols:rounded-corner",
          "@studioInpuTokenType size"
        ],
        "id": "#tokensConfig/radii",
        "properties": {
          "none": {
            "id": "#tokensConfig/radii/none",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/none/value",
                "default": "0px"
              }
            },
            "type": "object",
            "default": {
              "value": "0px"
            }
          },
          "2xs": {
            "id": "#tokensConfig/radii/2xs",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/2xs/value",
                "default": "0.125rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.125rem"
            }
          },
          "xs": {
            "id": "#tokensConfig/radii/xs",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/xs/value",
                "default": "0.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.25rem"
            }
          },
          "sm": {
            "id": "#tokensConfig/radii/sm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/sm/value",
                "default": "0.375rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.375rem"
            }
          },
          "md": {
            "id": "#tokensConfig/radii/md",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/md/value",
                "default": "0.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.5rem"
            }
          },
          "lg": {
            "id": "#tokensConfig/radii/lg",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/lg/value",
                "default": "0.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.75rem"
            }
          },
          "xl": {
            "id": "#tokensConfig/radii/xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/xl/value",
                "default": "1rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1rem"
            }
          },
          "2xl": {
            "id": "#tokensConfig/radii/2xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/2xl/value",
                "default": "1.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.5rem"
            }
          },
          "3xl": {
            "id": "#tokensConfig/radii/3xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/3xl/value",
                "default": "1.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.75rem"
            }
          },
          "full": {
            "id": "#tokensConfig/radii/full",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/radii/full/value",
                "default": "9999px"
              }
            },
            "type": "object",
            "default": {
              "value": "9999px"
            }
          }
        },
        "type": "object",
        "default": {
          "none": {
            "value": "0px"
          },
          "2xs": {
            "value": "0.125rem"
          },
          "xs": {
            "value": "0.25rem"
          },
          "sm": {
            "value": "0.375rem"
          },
          "md": {
            "value": "0.5rem"
          },
          "lg": {
            "value": "0.75rem"
          },
          "xl": {
            "value": "1rem"
          },
          "2xl": {
            "value": "1.5rem"
          },
          "3xl": {
            "value": "1.75rem"
          },
          "full": {
            "value": "9999px"
          }
        }
      },
      "size": {
        "title": "Your website sizings.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon ph:ruler"
        ],
        "id": "#tokensConfig/size",
        "properties": {
          "0": {
            "id": "#tokensConfig/size/0",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/0/value",
                "default": "0px"
              }
            },
            "type": "object",
            "default": {
              "value": "0px"
            }
          },
          "2": {
            "id": "#tokensConfig/size/2",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/2/value",
                "default": "2px"
              }
            },
            "type": "object",
            "default": {
              "value": "2px"
            }
          },
          "4": {
            "id": "#tokensConfig/size/4",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/4/value",
                "default": "4px"
              }
            },
            "type": "object",
            "default": {
              "value": "4px"
            }
          },
          "6": {
            "id": "#tokensConfig/size/6",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/6/value",
                "default": "6px"
              }
            },
            "type": "object",
            "default": {
              "value": "6px"
            }
          },
          "8": {
            "id": "#tokensConfig/size/8",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/8/value",
                "default": "8px"
              }
            },
            "type": "object",
            "default": {
              "value": "8px"
            }
          },
          "12": {
            "id": "#tokensConfig/size/12",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/12/value",
                "default": "12px"
              }
            },
            "type": "object",
            "default": {
              "value": "12px"
            }
          },
          "16": {
            "id": "#tokensConfig/size/16",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/16/value",
                "default": "16px"
              }
            },
            "type": "object",
            "default": {
              "value": "16px"
            }
          },
          "20": {
            "id": "#tokensConfig/size/20",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/20/value",
                "default": "20px"
              }
            },
            "type": "object",
            "default": {
              "value": "20px"
            }
          },
          "24": {
            "id": "#tokensConfig/size/24",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/24/value",
                "default": "24px"
              }
            },
            "type": "object",
            "default": {
              "value": "24px"
            }
          },
          "32": {
            "id": "#tokensConfig/size/32",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/32/value",
                "default": "32px"
              }
            },
            "type": "object",
            "default": {
              "value": "32px"
            }
          },
          "40": {
            "id": "#tokensConfig/size/40",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/40/value",
                "default": "40px"
              }
            },
            "type": "object",
            "default": {
              "value": "40px"
            }
          },
          "48": {
            "id": "#tokensConfig/size/48",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/48/value",
                "default": "48px"
              }
            },
            "type": "object",
            "default": {
              "value": "48px"
            }
          },
          "56": {
            "id": "#tokensConfig/size/56",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/56/value",
                "default": "56px"
              }
            },
            "type": "object",
            "default": {
              "value": "56px"
            }
          },
          "64": {
            "id": "#tokensConfig/size/64",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/64/value",
                "default": "64px"
              }
            },
            "type": "object",
            "default": {
              "value": "64px"
            }
          },
          "80": {
            "id": "#tokensConfig/size/80",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/80/value",
                "default": "80px"
              }
            },
            "type": "object",
            "default": {
              "value": "80px"
            }
          },
          "104": {
            "id": "#tokensConfig/size/104",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/104/value",
                "default": "104px"
              }
            },
            "type": "object",
            "default": {
              "value": "104px"
            }
          },
          "200": {
            "id": "#tokensConfig/size/200",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/200/value",
                "default": "200px"
              }
            },
            "type": "object",
            "default": {
              "value": "200px"
            }
          },
          "xs": {
            "id": "#tokensConfig/size/xs",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/xs/value",
                "default": "20rem"
              }
            },
            "type": "object",
            "default": {
              "value": "20rem"
            }
          },
          "sm": {
            "id": "#tokensConfig/size/sm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/sm/value",
                "default": "24rem"
              }
            },
            "type": "object",
            "default": {
              "value": "24rem"
            }
          },
          "md": {
            "id": "#tokensConfig/size/md",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/md/value",
                "default": "28rem"
              }
            },
            "type": "object",
            "default": {
              "value": "28rem"
            }
          },
          "lg": {
            "id": "#tokensConfig/size/lg",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/lg/value",
                "default": "32rem"
              }
            },
            "type": "object",
            "default": {
              "value": "32rem"
            }
          },
          "xl": {
            "id": "#tokensConfig/size/xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/xl/value",
                "default": "36rem"
              }
            },
            "type": "object",
            "default": {
              "value": "36rem"
            }
          },
          "2xl": {
            "id": "#tokensConfig/size/2xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/2xl/value",
                "default": "42rem"
              }
            },
            "type": "object",
            "default": {
              "value": "42rem"
            }
          },
          "3xl": {
            "id": "#tokensConfig/size/3xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/3xl/value",
                "default": "48rem"
              }
            },
            "type": "object",
            "default": {
              "value": "48rem"
            }
          },
          "4xl": {
            "id": "#tokensConfig/size/4xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/4xl/value",
                "default": "56rem"
              }
            },
            "type": "object",
            "default": {
              "value": "56rem"
            }
          },
          "5xl": {
            "id": "#tokensConfig/size/5xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/5xl/value",
                "default": "64rem"
              }
            },
            "type": "object",
            "default": {
              "value": "64rem"
            }
          },
          "6xl": {
            "id": "#tokensConfig/size/6xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/6xl/value",
                "default": "72rem"
              }
            },
            "type": "object",
            "default": {
              "value": "72rem"
            }
          },
          "7xl": {
            "id": "#tokensConfig/size/7xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/7xl/value",
                "default": "80rem"
              }
            },
            "type": "object",
            "default": {
              "value": "80rem"
            }
          },
          "full": {
            "id": "#tokensConfig/size/full",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/size/full/value",
                "default": "100%"
              }
            },
            "type": "object",
            "default": {
              "value": "100%"
            }
          }
        },
        "type": "object",
        "default": {
          "0": {
            "value": "0px"
          },
          "2": {
            "value": "2px"
          },
          "4": {
            "value": "4px"
          },
          "6": {
            "value": "6px"
          },
          "8": {
            "value": "8px"
          },
          "12": {
            "value": "12px"
          },
          "16": {
            "value": "16px"
          },
          "20": {
            "value": "20px"
          },
          "24": {
            "value": "24px"
          },
          "32": {
            "value": "32px"
          },
          "40": {
            "value": "40px"
          },
          "48": {
            "value": "48px"
          },
          "56": {
            "value": "56px"
          },
          "64": {
            "value": "64px"
          },
          "80": {
            "value": "80px"
          },
          "104": {
            "value": "104px"
          },
          "200": {
            "value": "200px"
          },
          "xs": {
            "value": "20rem"
          },
          "sm": {
            "value": "24rem"
          },
          "md": {
            "value": "28rem"
          },
          "lg": {
            "value": "32rem"
          },
          "xl": {
            "value": "36rem"
          },
          "2xl": {
            "value": "42rem"
          },
          "3xl": {
            "value": "48rem"
          },
          "4xl": {
            "value": "56rem"
          },
          "5xl": {
            "value": "64rem"
          },
          "6xl": {
            "value": "72rem"
          },
          "7xl": {
            "value": "80rem"
          },
          "full": {
            "value": "100%"
          }
        }
      },
      "space": {
        "title": "Your website spacings.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon ph:ruler"
        ],
        "id": "#tokensConfig/space",
        "properties": {
          "0": {
            "id": "#tokensConfig/space/0",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/0/value",
                "default": "0px"
              }
            },
            "type": "object",
            "default": {
              "value": "0px"
            }
          },
          "1": {
            "id": "#tokensConfig/space/1",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/1/value",
                "default": "0.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.25rem"
            }
          },
          "2": {
            "id": "#tokensConfig/space/2",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/2/value",
                "default": "0.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.5rem"
            }
          },
          "3": {
            "id": "#tokensConfig/space/3",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/3/value",
                "default": "0.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.75rem"
            }
          },
          "4": {
            "id": "#tokensConfig/space/4",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/4/value",
                "default": "1rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1rem"
            }
          },
          "5": {
            "id": "#tokensConfig/space/5",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/5/value",
                "default": "1.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.25rem"
            }
          },
          "6": {
            "id": "#tokensConfig/space/6",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/6/value",
                "default": "1.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.5rem"
            }
          },
          "7": {
            "id": "#tokensConfig/space/7",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/7/value",
                "default": "1.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.75rem"
            }
          },
          "8": {
            "id": "#tokensConfig/space/8",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/8/value",
                "default": "2rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2rem"
            }
          },
          "9": {
            "id": "#tokensConfig/space/9",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/9/value",
                "default": "2.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2.25rem"
            }
          },
          "10": {
            "id": "#tokensConfig/space/10",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/10/value",
                "default": "2.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2.5rem"
            }
          },
          "11": {
            "id": "#tokensConfig/space/11",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/11/value",
                "default": "2.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2.75rem"
            }
          },
          "12": {
            "id": "#tokensConfig/space/12",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/12/value",
                "default": "3rem"
              }
            },
            "type": "object",
            "default": {
              "value": "3rem"
            }
          },
          "14": {
            "id": "#tokensConfig/space/14",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/14/value",
                "default": "3.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "3.5rem"
            }
          },
          "16": {
            "id": "#tokensConfig/space/16",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/16/value",
                "default": "4rem"
              }
            },
            "type": "object",
            "default": {
              "value": "4rem"
            }
          },
          "20": {
            "id": "#tokensConfig/space/20",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/20/value",
                "default": "5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "5rem"
            }
          },
          "24": {
            "id": "#tokensConfig/space/24",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/24/value",
                "default": "6rem"
              }
            },
            "type": "object",
            "default": {
              "value": "6rem"
            }
          },
          "28": {
            "id": "#tokensConfig/space/28",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/28/value",
                "default": "7rem"
              }
            },
            "type": "object",
            "default": {
              "value": "7rem"
            }
          },
          "32": {
            "id": "#tokensConfig/space/32",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/32/value",
                "default": "8rem"
              }
            },
            "type": "object",
            "default": {
              "value": "8rem"
            }
          },
          "36": {
            "id": "#tokensConfig/space/36",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/36/value",
                "default": "9rem"
              }
            },
            "type": "object",
            "default": {
              "value": "9rem"
            }
          },
          "40": {
            "id": "#tokensConfig/space/40",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/40/value",
                "default": "10rem"
              }
            },
            "type": "object",
            "default": {
              "value": "10rem"
            }
          },
          "44": {
            "id": "#tokensConfig/space/44",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/44/value",
                "default": "11rem"
              }
            },
            "type": "object",
            "default": {
              "value": "11rem"
            }
          },
          "48": {
            "id": "#tokensConfig/space/48",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/48/value",
                "default": "12rem"
              }
            },
            "type": "object",
            "default": {
              "value": "12rem"
            }
          },
          "52": {
            "id": "#tokensConfig/space/52",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/52/value",
                "default": "13rem"
              }
            },
            "type": "object",
            "default": {
              "value": "13rem"
            }
          },
          "56": {
            "id": "#tokensConfig/space/56",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/56/value",
                "default": "14rem"
              }
            },
            "type": "object",
            "default": {
              "value": "14rem"
            }
          },
          "60": {
            "id": "#tokensConfig/space/60",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/60/value",
                "default": "15rem"
              }
            },
            "type": "object",
            "default": {
              "value": "15rem"
            }
          },
          "64": {
            "id": "#tokensConfig/space/64",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/64/value",
                "default": "16rem"
              }
            },
            "type": "object",
            "default": {
              "value": "16rem"
            }
          },
          "72": {
            "id": "#tokensConfig/space/72",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/72/value",
                "default": "18rem"
              }
            },
            "type": "object",
            "default": {
              "value": "18rem"
            }
          },
          "80": {
            "id": "#tokensConfig/space/80",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/80/value",
                "default": "20rem"
              }
            },
            "type": "object",
            "default": {
              "value": "20rem"
            }
          },
          "96": {
            "id": "#tokensConfig/space/96",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/96/value",
                "default": "24rem"
              }
            },
            "type": "object",
            "default": {
              "value": "24rem"
            }
          },
          "128": {
            "id": "#tokensConfig/space/128",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/128/value",
                "default": "32rem"
              }
            },
            "type": "object",
            "default": {
              "value": "32rem"
            }
          },
          "px": {
            "id": "#tokensConfig/space/px",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/space/px/value",
                "default": "1px"
              }
            },
            "type": "object",
            "default": {
              "value": "1px"
            }
          },
          "rem": {
            "id": "#tokensConfig/space/rem",
            "properties": {
              "125": {
                "id": "#tokensConfig/space/rem/125",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/space/rem/125/value",
                    "default": "0.125rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0.125rem"
                }
              },
              "375": {
                "id": "#tokensConfig/space/rem/375",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/space/rem/375/value",
                    "default": "0.375rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0.375rem"
                }
              },
              "625": {
                "id": "#tokensConfig/space/rem/625",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/space/rem/625/value",
                    "default": "0.625rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0.625rem"
                }
              },
              "875": {
                "id": "#tokensConfig/space/rem/875",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/space/rem/875/value",
                    "default": "0.875rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0.875rem"
                }
              }
            },
            "type": "object",
            "default": {
              "125": {
                "value": "0.125rem"
              },
              "375": {
                "value": "0.375rem"
              },
              "625": {
                "value": "0.625rem"
              },
              "875": {
                "value": "0.875rem"
              }
            }
          }
        },
        "type": "object",
        "default": {
          "0": {
            "value": "0px"
          },
          "1": {
            "value": "0.25rem"
          },
          "2": {
            "value": "0.5rem"
          },
          "3": {
            "value": "0.75rem"
          },
          "4": {
            "value": "1rem"
          },
          "5": {
            "value": "1.25rem"
          },
          "6": {
            "value": "1.5rem"
          },
          "7": {
            "value": "1.75rem"
          },
          "8": {
            "value": "2rem"
          },
          "9": {
            "value": "2.25rem"
          },
          "10": {
            "value": "2.5rem"
          },
          "11": {
            "value": "2.75rem"
          },
          "12": {
            "value": "3rem"
          },
          "14": {
            "value": "3.5rem"
          },
          "16": {
            "value": "4rem"
          },
          "20": {
            "value": "5rem"
          },
          "24": {
            "value": "6rem"
          },
          "28": {
            "value": "7rem"
          },
          "32": {
            "value": "8rem"
          },
          "36": {
            "value": "9rem"
          },
          "40": {
            "value": "10rem"
          },
          "44": {
            "value": "11rem"
          },
          "48": {
            "value": "12rem"
          },
          "52": {
            "value": "13rem"
          },
          "56": {
            "value": "14rem"
          },
          "60": {
            "value": "15rem"
          },
          "64": {
            "value": "16rem"
          },
          "72": {
            "value": "18rem"
          },
          "80": {
            "value": "20rem"
          },
          "96": {
            "value": "24rem"
          },
          "128": {
            "value": "32rem"
          },
          "px": {
            "value": "1px"
          },
          "rem": {
            "125": {
              "value": "0.125rem"
            },
            "375": {
              "value": "0.375rem"
            },
            "625": {
              "value": "0.625rem"
            },
            "875": {
              "value": "0.875rem"
            }
          }
        }
      },
      "borderWidth": {
        "title": "Your website border widths.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon material-symbols:border-all-outline-rounded"
        ],
        "id": "#tokensConfig/borderWidth",
        "properties": {
          "noBorder": {
            "id": "#tokensConfig/borderWidth/noBorder",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/borderWidth/noBorder/value",
                "default": "0"
              }
            },
            "type": "object",
            "default": {
              "value": "0"
            }
          },
          "sm": {
            "id": "#tokensConfig/borderWidth/sm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/borderWidth/sm/value",
                "default": "1px"
              }
            },
            "type": "object",
            "default": {
              "value": "1px"
            }
          },
          "md": {
            "id": "#tokensConfig/borderWidth/md",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/borderWidth/md/value",
                "default": "2px"
              }
            },
            "type": "object",
            "default": {
              "value": "2px"
            }
          },
          "lg": {
            "id": "#tokensConfig/borderWidth/lg",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/borderWidth/lg/value",
                "default": "3px"
              }
            },
            "type": "object",
            "default": {
              "value": "3px"
            }
          }
        },
        "type": "object",
        "default": {
          "noBorder": {
            "value": "0"
          },
          "sm": {
            "value": "1px"
          },
          "md": {
            "value": "2px"
          },
          "lg": {
            "value": "3px"
          }
        }
      },
      "opacity": {
        "title": "Your website opacities.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType opacity",
          "@studioIcon material-symbols:opacity"
        ],
        "id": "#tokensConfig/opacity",
        "properties": {
          "noOpacity": {
            "id": "#tokensConfig/opacity/noOpacity",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/noOpacity/value",
                "default": "0"
              }
            },
            "type": "object",
            "default": {
              "value": "0"
            }
          },
          "bright": {
            "id": "#tokensConfig/opacity/bright",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/bright/value",
                "default": "0.1"
              }
            },
            "type": "object",
            "default": {
              "value": "0.1"
            }
          },
          "light": {
            "id": "#tokensConfig/opacity/light",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/light/value",
                "default": "0.15"
              }
            },
            "type": "object",
            "default": {
              "value": "0.15"
            }
          },
          "soft": {
            "id": "#tokensConfig/opacity/soft",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/soft/value",
                "default": "0.3"
              }
            },
            "type": "object",
            "default": {
              "value": "0.3"
            }
          },
          "medium": {
            "id": "#tokensConfig/opacity/medium",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/medium/value",
                "default": "0.5"
              }
            },
            "type": "object",
            "default": {
              "value": "0.5"
            }
          },
          "high": {
            "id": "#tokensConfig/opacity/high",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/high/value",
                "default": "0.8"
              }
            },
            "type": "object",
            "default": {
              "value": "0.8"
            }
          },
          "total": {
            "id": "#tokensConfig/opacity/total",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/opacity/total/value",
                "default": "1"
              }
            },
            "type": "object",
            "default": {
              "value": "1"
            }
          }
        },
        "type": "object",
        "default": {
          "noOpacity": {
            "value": "0"
          },
          "bright": {
            "value": "0.1"
          },
          "light": {
            "value": "0.15"
          },
          "soft": {
            "value": "0.3"
          },
          "medium": {
            "value": "0.5"
          },
          "high": {
            "value": "0.8"
          },
          "total": {
            "value": "1"
          }
        }
      },
      "font": {
        "title": "Your website fonts",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType font",
          "@studioIcon material-symbols:font-download-rounded"
        ],
        "id": "#tokensConfig/font",
        "properties": {
          "sans": {
            "id": "#tokensConfig/font/sans",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/font/sans/value",
                "default": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
              }
            },
            "type": "object",
            "default": {
              "value": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
            }
          },
          "serif": {
            "id": "#tokensConfig/font/serif",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/font/serif/value",
                "default": "ui-serif, Georgia, Cambria, Times New Roman, Times, serif"
              }
            },
            "type": "object",
            "default": {
              "value": "ui-serif, Georgia, Cambria, Times New Roman, Times, serif"
            }
          },
          "mono": {
            "id": "#tokensConfig/font/mono",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/font/mono/value",
                "default": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
              }
            },
            "type": "object",
            "default": {
              "value": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
            }
          }
        },
        "type": "object",
        "default": {
          "sans": {
            "value": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
          },
          "serif": {
            "value": "ui-serif, Georgia, Cambria, Times New Roman, Times, serif"
          },
          "mono": {
            "value": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
          }
        }
      },
      "fontWeight": {
        "title": "Your website font weights.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType font-weight",
          "@studioIcon radix-icons:font-style"
        ],
        "id": "#tokensConfig/fontWeight",
        "properties": {
          "thin": {
            "id": "#tokensConfig/fontWeight/thin",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/thin/value",
                "default": "100"
              }
            },
            "type": "object",
            "default": {
              "value": "100"
            }
          },
          "extralight": {
            "id": "#tokensConfig/fontWeight/extralight",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/extralight/value",
                "default": "200"
              }
            },
            "type": "object",
            "default": {
              "value": "200"
            }
          },
          "light": {
            "id": "#tokensConfig/fontWeight/light",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/light/value",
                "default": "300"
              }
            },
            "type": "object",
            "default": {
              "value": "300"
            }
          },
          "normal": {
            "id": "#tokensConfig/fontWeight/normal",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/normal/value",
                "default": "400"
              }
            },
            "type": "object",
            "default": {
              "value": "400"
            }
          },
          "medium": {
            "id": "#tokensConfig/fontWeight/medium",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/medium/value",
                "default": "500"
              }
            },
            "type": "object",
            "default": {
              "value": "500"
            }
          },
          "semibold": {
            "id": "#tokensConfig/fontWeight/semibold",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/semibold/value",
                "default": "600"
              }
            },
            "type": "object",
            "default": {
              "value": "600"
            }
          },
          "bold": {
            "id": "#tokensConfig/fontWeight/bold",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/bold/value",
                "default": "700"
              }
            },
            "type": "object",
            "default": {
              "value": "700"
            }
          },
          "extrabold": {
            "id": "#tokensConfig/fontWeight/extrabold",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/extrabold/value",
                "default": "800"
              }
            },
            "type": "object",
            "default": {
              "value": "800"
            }
          },
          "black": {
            "id": "#tokensConfig/fontWeight/black",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontWeight/black/value",
                "default": "900"
              }
            },
            "type": "object",
            "default": {
              "value": "900"
            }
          }
        },
        "type": "object",
        "default": {
          "thin": {
            "value": "100"
          },
          "extralight": {
            "value": "200"
          },
          "light": {
            "value": "300"
          },
          "normal": {
            "value": "400"
          },
          "medium": {
            "value": "500"
          },
          "semibold": {
            "value": "600"
          },
          "bold": {
            "value": "700"
          },
          "extrabold": {
            "value": "800"
          },
          "black": {
            "value": "900"
          }
        }
      },
      "fontSize": {
        "title": "Your website font sizes.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType font-size",
          "@studioIcon radix-icons:font-style"
        ],
        "id": "#tokensConfig/fontSize",
        "properties": {
          "xs": {
            "id": "#tokensConfig/fontSize/xs",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/xs/value",
                "default": "0.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.75rem"
            }
          },
          "sm": {
            "id": "#tokensConfig/fontSize/sm",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/sm/value",
                "default": "0.875rem"
              }
            },
            "type": "object",
            "default": {
              "value": "0.875rem"
            }
          },
          "base": {
            "id": "#tokensConfig/fontSize/base",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/base/value",
                "default": "1rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1rem"
            }
          },
          "lg": {
            "id": "#tokensConfig/fontSize/lg",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/lg/value",
                "default": "1.125rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.125rem"
            }
          },
          "xl": {
            "id": "#tokensConfig/fontSize/xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/xl/value",
                "default": "1.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.25rem"
            }
          },
          "2xl": {
            "id": "#tokensConfig/fontSize/2xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/2xl/value",
                "default": "1.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.5rem"
            }
          },
          "3xl": {
            "id": "#tokensConfig/fontSize/3xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/3xl/value",
                "default": "1.875rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.875rem"
            }
          },
          "4xl": {
            "id": "#tokensConfig/fontSize/4xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/4xl/value",
                "default": "2.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2.25rem"
            }
          },
          "5xl": {
            "id": "#tokensConfig/fontSize/5xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/5xl/value",
                "default": "3rem"
              }
            },
            "type": "object",
            "default": {
              "value": "3rem"
            }
          },
          "6xl": {
            "id": "#tokensConfig/fontSize/6xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/6xl/value",
                "default": "3.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "3.75rem"
            }
          },
          "7xl": {
            "id": "#tokensConfig/fontSize/7xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/7xl/value",
                "default": "4.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "4.5rem"
            }
          },
          "8xl": {
            "id": "#tokensConfig/fontSize/8xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/8xl/value",
                "default": "6rem"
              }
            },
            "type": "object",
            "default": {
              "value": "6rem"
            }
          },
          "9xl": {
            "id": "#tokensConfig/fontSize/9xl",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/fontSize/9xl/value",
                "default": "8rem"
              }
            },
            "type": "object",
            "default": {
              "value": "8rem"
            }
          }
        },
        "type": "object",
        "default": {
          "xs": {
            "value": "0.75rem"
          },
          "sm": {
            "value": "0.875rem"
          },
          "base": {
            "value": "1rem"
          },
          "lg": {
            "value": "1.125rem"
          },
          "xl": {
            "value": "1.25rem"
          },
          "2xl": {
            "value": "1.5rem"
          },
          "3xl": {
            "value": "1.875rem"
          },
          "4xl": {
            "value": "2.25rem"
          },
          "5xl": {
            "value": "3rem"
          },
          "6xl": {
            "value": "3.75rem"
          },
          "7xl": {
            "value": "4.5rem"
          },
          "8xl": {
            "value": "6rem"
          },
          "9xl": {
            "value": "8rem"
          }
        }
      },
      "letterSpacing": {
        "title": "Your website letter spacings.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType letter-spacing",
          "@studioIcon fluent:font-space-tracking-out-24-filled"
        ],
        "id": "#tokensConfig/letterSpacing",
        "properties": {
          "tighter": {
            "id": "#tokensConfig/letterSpacing/tighter",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/letterSpacing/tighter/value",
                "default": "-0.05em"
              }
            },
            "type": "object",
            "default": {
              "value": "-0.05em"
            }
          },
          "tight": {
            "id": "#tokensConfig/letterSpacing/tight",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/letterSpacing/tight/value",
                "default": "-0.025em"
              }
            },
            "type": "object",
            "default": {
              "value": "-0.025em"
            }
          },
          "normal": {
            "id": "#tokensConfig/letterSpacing/normal",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/letterSpacing/normal/value",
                "default": "0em"
              }
            },
            "type": "object",
            "default": {
              "value": "0em"
            }
          },
          "wide": {
            "id": "#tokensConfig/letterSpacing/wide",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/letterSpacing/wide/value",
                "default": "0.025em"
              }
            },
            "type": "object",
            "default": {
              "value": "0.025em"
            }
          },
          "wider": {
            "id": "#tokensConfig/letterSpacing/wider",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/letterSpacing/wider/value",
                "default": "0.05em"
              }
            },
            "type": "object",
            "default": {
              "value": "0.05em"
            }
          },
          "widest": {
            "id": "#tokensConfig/letterSpacing/widest",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/letterSpacing/widest/value",
                "default": "0.1em"
              }
            },
            "type": "object",
            "default": {
              "value": "0.1em"
            }
          }
        },
        "type": "object",
        "default": {
          "tighter": {
            "value": "-0.05em"
          },
          "tight": {
            "value": "-0.025em"
          },
          "normal": {
            "value": "0em"
          },
          "wide": {
            "value": "0.025em"
          },
          "wider": {
            "value": "0.05em"
          },
          "widest": {
            "value": "0.1em"
          }
        }
      },
      "lead": {
        "title": "Your website line heights.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon icon-park-outline:auto-line-height"
        ],
        "id": "#tokensConfig/lead",
        "properties": {
          "1": {
            "id": "#tokensConfig/lead/1",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/1/value",
                "default": ".025rem"
              }
            },
            "type": "object",
            "default": {
              "value": ".025rem"
            }
          },
          "2": {
            "id": "#tokensConfig/lead/2",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/2/value",
                "default": ".5rem"
              }
            },
            "type": "object",
            "default": {
              "value": ".5rem"
            }
          },
          "3": {
            "id": "#tokensConfig/lead/3",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/3/value",
                "default": ".75rem"
              }
            },
            "type": "object",
            "default": {
              "value": ".75rem"
            }
          },
          "4": {
            "id": "#tokensConfig/lead/4",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/4/value",
                "default": "1rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1rem"
            }
          },
          "5": {
            "id": "#tokensConfig/lead/5",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/5/value",
                "default": "1.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.25rem"
            }
          },
          "6": {
            "id": "#tokensConfig/lead/6",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/6/value",
                "default": "1.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.5rem"
            }
          },
          "7": {
            "id": "#tokensConfig/lead/7",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/7/value",
                "default": "1.75rem"
              }
            },
            "type": "object",
            "default": {
              "value": "1.75rem"
            }
          },
          "8": {
            "id": "#tokensConfig/lead/8",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/8/value",
                "default": "2rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2rem"
            }
          },
          "9": {
            "id": "#tokensConfig/lead/9",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/9/value",
                "default": "2.25rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2.25rem"
            }
          },
          "10": {
            "id": "#tokensConfig/lead/10",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/10/value",
                "default": "2.5rem"
              }
            },
            "type": "object",
            "default": {
              "value": "2.5rem"
            }
          },
          "none": {
            "id": "#tokensConfig/lead/none",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/none/value",
                "default": "1"
              }
            },
            "type": "object",
            "default": {
              "value": "1"
            }
          },
          "tight": {
            "id": "#tokensConfig/lead/tight",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/tight/value",
                "default": "1.25"
              }
            },
            "type": "object",
            "default": {
              "value": "1.25"
            }
          },
          "snug": {
            "id": "#tokensConfig/lead/snug",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/snug/value",
                "default": "1.375"
              }
            },
            "type": "object",
            "default": {
              "value": "1.375"
            }
          },
          "normal": {
            "id": "#tokensConfig/lead/normal",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/normal/value",
                "default": "1.5"
              }
            },
            "type": "object",
            "default": {
              "value": "1.5"
            }
          },
          "relaxed": {
            "id": "#tokensConfig/lead/relaxed",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/relaxed/value",
                "default": "1.625"
              }
            },
            "type": "object",
            "default": {
              "value": "1.625"
            }
          },
          "loose": {
            "id": "#tokensConfig/lead/loose",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/lead/loose/value",
                "default": "2"
              }
            },
            "type": "object",
            "default": {
              "value": "2"
            }
          }
        },
        "type": "object",
        "default": {
          "1": {
            "value": ".025rem"
          },
          "2": {
            "value": ".5rem"
          },
          "3": {
            "value": ".75rem"
          },
          "4": {
            "value": "1rem"
          },
          "5": {
            "value": "1.25rem"
          },
          "6": {
            "value": "1.5rem"
          },
          "7": {
            "value": "1.75rem"
          },
          "8": {
            "value": "2rem"
          },
          "9": {
            "value": "2.25rem"
          },
          "10": {
            "value": "2.5rem"
          },
          "none": {
            "value": "1"
          },
          "tight": {
            "value": "1.25"
          },
          "snug": {
            "value": "1.375"
          },
          "normal": {
            "value": "1.5"
          },
          "relaxed": {
            "value": "1.625"
          },
          "loose": {
            "value": "2"
          }
        }
      },
      "text": {
        "title": "Your website text scales.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType size",
          "@studioIcon material-symbols:format-size-rounded"
        ],
        "id": "#tokensConfig/text",
        "properties": {
          "xs": {
            "id": "#tokensConfig/text/xs",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/xs/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/xs/fontSize/value",
                    "default": "{fontSize.xs}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.xs}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/xs/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/xs/lineHeight/value",
                    "default": "{lead.4}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.4}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.xs}"
              },
              "lineHeight": {
                "value": "{lead.4}"
              }
            }
          },
          "sm": {
            "id": "#tokensConfig/text/sm",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/sm/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/sm/fontSize/value",
                    "default": "{fontSize.sm}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.sm}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/sm/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/sm/lineHeight/value",
                    "default": "{lead.5}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.5}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.sm}"
              },
              "lineHeight": {
                "value": "{lead.5}"
              }
            }
          },
          "base": {
            "id": "#tokensConfig/text/base",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/base/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/base/fontSize/value",
                    "default": "{fontSize.base}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.base}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/base/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/base/lineHeight/value",
                    "default": "{lead.6}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.6}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.base}"
              },
              "lineHeight": {
                "value": "{lead.6}"
              }
            }
          },
          "lg": {
            "id": "#tokensConfig/text/lg",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/lg/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/lg/fontSize/value",
                    "default": "{fontSize.lg}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.lg}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/lg/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/lg/lineHeight/value",
                    "default": "{lead.7}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.7}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.lg}"
              },
              "lineHeight": {
                "value": "{lead.7}"
              }
            }
          },
          "xl": {
            "id": "#tokensConfig/text/xl",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/xl/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/xl/fontSize/value",
                    "default": "{fontSize.xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/xl/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/xl/lineHeight/value",
                    "default": "{lead.7}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.7}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.xl}"
              },
              "lineHeight": {
                "value": "{lead.7}"
              }
            }
          },
          "2xl": {
            "id": "#tokensConfig/text/2xl",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/2xl/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/2xl/fontSize/value",
                    "default": "{fontSize.2xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.2xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/2xl/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/2xl/lineHeight/value",
                    "default": "{lead.8}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.8}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.2xl}"
              },
              "lineHeight": {
                "value": "{lead.8}"
              }
            }
          },
          "3xl": {
            "id": "#tokensConfig/text/3xl",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/3xl/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/3xl/fontSize/value",
                    "default": "{fontSize.3xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.3xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/3xl/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/3xl/lineHeight/value",
                    "default": "{lead.9}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.9}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.3xl}"
              },
              "lineHeight": {
                "value": "{lead.9}"
              }
            }
          },
          "4xl": {
            "id": "#tokensConfig/text/4xl",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/4xl/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/4xl/fontSize/value",
                    "default": "{fontSize.4xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.4xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/4xl/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/4xl/lineHeight/value",
                    "default": "{lead.10}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.10}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.4xl}"
              },
              "lineHeight": {
                "value": "{lead.10}"
              }
            }
          },
          "5xl": {
            "id": "#tokensConfig/text/5xl",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/5xl/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/5xl/fontSize/value",
                    "default": "{fontSize.5xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.5xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/5xl/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/5xl/lineHeight/value",
                    "default": "{lead.none}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.none}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.5xl}"
              },
              "lineHeight": {
                "value": "{lead.none}"
              }
            }
          },
          "6xl": {
            "id": "#tokensConfig/text/6xl",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/text/6xl/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/6xl/fontSize/value",
                    "default": "{fontSize.6xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{fontSize.6xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/text/6xl/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/text/6xl/lineHeight/value",
                    "default": "{lead.none}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{lead.none}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{fontSize.6xl}"
              },
              "lineHeight": {
                "value": "{lead.none}"
              }
            }
          }
        },
        "type": "object",
        "default": {
          "xs": {
            "fontSize": {
              "value": "{fontSize.xs}"
            },
            "lineHeight": {
              "value": "{lead.4}"
            }
          },
          "sm": {
            "fontSize": {
              "value": "{fontSize.sm}"
            },
            "lineHeight": {
              "value": "{lead.5}"
            }
          },
          "base": {
            "fontSize": {
              "value": "{fontSize.base}"
            },
            "lineHeight": {
              "value": "{lead.6}"
            }
          },
          "lg": {
            "fontSize": {
              "value": "{fontSize.lg}"
            },
            "lineHeight": {
              "value": "{lead.7}"
            }
          },
          "xl": {
            "fontSize": {
              "value": "{fontSize.xl}"
            },
            "lineHeight": {
              "value": "{lead.7}"
            }
          },
          "2xl": {
            "fontSize": {
              "value": "{fontSize.2xl}"
            },
            "lineHeight": {
              "value": "{lead.8}"
            }
          },
          "3xl": {
            "fontSize": {
              "value": "{fontSize.3xl}"
            },
            "lineHeight": {
              "value": "{lead.9}"
            }
          },
          "4xl": {
            "fontSize": {
              "value": "{fontSize.4xl}"
            },
            "lineHeight": {
              "value": "{lead.10}"
            }
          },
          "5xl": {
            "fontSize": {
              "value": "{fontSize.5xl}"
            },
            "lineHeight": {
              "value": "{lead.none}"
            }
          },
          "6xl": {
            "fontSize": {
              "value": "{fontSize.6xl}"
            },
            "lineHeight": {
              "value": "{lead.none}"
            }
          }
        }
      },
      "elements": {
        "title": "All the configurable tokens for your Elements.",
        "tags": [
          "@studioIcon uiw:component"
        ],
        "id": "#tokensConfig/elements",
        "properties": {
          "text": {
            "id": "#tokensConfig/elements/text",
            "properties": {
              "primary": {
                "id": "#tokensConfig/elements/text/primary",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/text/primary/color",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/elements/text/primary/color/static",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/text/primary/color/static/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/text/primary/color/static/value/initial",
                                "default": "{color.gray.900}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/text/primary/color/static/value/dark",
                                "default": "{color.gray.50}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.gray.900}",
                              "dark": "{color.gray.50}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.gray.900}",
                            "dark": "{color.gray.50}"
                          }
                        }
                      },
                      "hover": {
                        "id": "#tokensConfig/elements/text/primary/color/hover",
                        "type": "any",
                        "default": {}
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {
                        "value": {
                          "initial": "{color.gray.900}",
                          "dark": "{color.gray.50}"
                        }
                      },
                      "hover": {}
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "static": {
                      "value": {
                        "initial": "{color.gray.900}",
                        "dark": "{color.gray.50}"
                      }
                    },
                    "hover": {}
                  }
                }
              },
              "secondary": {
                "id": "#tokensConfig/elements/text/secondary",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/text/secondary/color",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/elements/text/secondary/color/static",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/text/secondary/color/static/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/text/secondary/color/static/value/initial",
                                "default": "{color.gray.500}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/text/secondary/color/static/value/dark",
                                "default": "{color.gray.400}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.gray.500}",
                              "dark": "{color.gray.400}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.gray.500}",
                            "dark": "{color.gray.400}"
                          }
                        }
                      },
                      "hover": {
                        "id": "#tokensConfig/elements/text/secondary/color/hover",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/text/secondary/color/hover/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/text/secondary/color/hover/value/initial",
                                "default": "{color.gray.700}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/text/secondary/color/hover/value/dark",
                                "default": "{color.gray.200}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.gray.700}",
                              "dark": "{color.gray.200}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.gray.700}",
                            "dark": "{color.gray.200}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {
                        "value": {
                          "initial": "{color.gray.500}",
                          "dark": "{color.gray.400}"
                        }
                      },
                      "hover": {
                        "value": {
                          "initial": "{color.gray.700}",
                          "dark": "{color.gray.200}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "static": {
                      "value": {
                        "initial": "{color.gray.500}",
                        "dark": "{color.gray.400}"
                      }
                    },
                    "hover": {
                      "value": {
                        "initial": "{color.gray.700}",
                        "dark": "{color.gray.200}"
                      }
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "primary": {
                "color": {
                  "static": {
                    "value": {
                      "initial": "{color.gray.900}",
                      "dark": "{color.gray.50}"
                    }
                  },
                  "hover": {}
                }
              },
              "secondary": {
                "color": {
                  "static": {
                    "value": {
                      "initial": "{color.gray.500}",
                      "dark": "{color.gray.400}"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "{color.gray.700}",
                      "dark": "{color.gray.200}"
                    }
                  }
                }
              }
            }
          },
          "container": {
            "title": "Main container sizings.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType size",
              "@studioIcon material-symbols:width-full-outline"
            ],
            "id": "#tokensConfig/elements/container",
            "properties": {
              "maxWidth": {
                "id": "#tokensConfig/elements/container/maxWidth",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/elements/container/maxWidth/value",
                    "default": "80rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "80rem"
                }
              },
              "padding": {
                "id": "#tokensConfig/elements/container/padding",
                "properties": {
                  "mobile": {
                    "id": "#tokensConfig/elements/container/padding/mobile",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/elements/container/padding/mobile/value",
                        "default": "{space.4}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{space.4}"
                    }
                  },
                  "xs": {
                    "id": "#tokensConfig/elements/container/padding/xs",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/elements/container/padding/xs/value",
                        "default": "{space.4}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{space.4}"
                    }
                  },
                  "sm": {
                    "id": "#tokensConfig/elements/container/padding/sm",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/elements/container/padding/sm/value",
                        "default": "{space.6}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{space.6}"
                    }
                  },
                  "md": {
                    "id": "#tokensConfig/elements/container/padding/md",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/elements/container/padding/md/value",
                        "default": "{space.6}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{space.6}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "mobile": {
                    "value": "{space.4}"
                  },
                  "xs": {
                    "value": "{space.4}"
                  },
                  "sm": {
                    "value": "{space.6}"
                  },
                  "md": {
                    "value": "{space.6}"
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "maxWidth": {
                "value": "80rem"
              },
              "padding": {
                "mobile": {
                  "value": "{space.4}"
                },
                "xs": {
                  "value": "{space.4}"
                },
                "sm": {
                  "value": "{space.6}"
                },
                "md": {
                  "value": "{space.6}"
                }
              }
            }
          },
          "backdrop": {
            "title": "Backdrops used in Elements.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType size",
              "@studioIcon material-symbols:blur-circular"
            ],
            "id": "#tokensConfig/elements/backdrop",
            "properties": {
              "filter": {
                "id": "#tokensConfig/elements/backdrop/filter",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/elements/backdrop/filter/value",
                    "default": "saturate(200%) blur(20px)"
                  }
                },
                "type": "object",
                "default": {
                  "value": "saturate(200%) blur(20px)"
                }
              },
              "background": {
                "id": "#tokensConfig/elements/backdrop/background",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/elements/backdrop/background/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/elements/backdrop/background/value/initial",
                        "default": "#fffc"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/elements/backdrop/background/value/dark",
                        "default": "#0c0d0ccc"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "#fffc",
                      "dark": "#0c0d0ccc"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "#fffc",
                    "dark": "#0c0d0ccc"
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "filter": {
                "value": "saturate(200%) blur(20px)"
              },
              "background": {
                "value": {
                  "initial": "#fffc",
                  "dark": "#0c0d0ccc"
                }
              }
            }
          },
          "border": {
            "title": "Borders used in Elements.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType color",
              "@studioIcon material-symbols:border-all-outline-rounded"
            ],
            "id": "#tokensConfig/elements/border",
            "properties": {
              "primary": {
                "id": "#tokensConfig/elements/border/primary",
                "properties": {
                  "static": {
                    "id": "#tokensConfig/elements/border/primary/static",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/border/primary/static/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/primary/static/value/initial",
                            "default": "{color.gray.100}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/primary/static/value/dark",
                            "default": "{color.gray.900}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.100}",
                          "dark": "{color.gray.900}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.100}",
                        "dark": "{color.gray.900}"
                      }
                    }
                  },
                  "hover": {
                    "id": "#tokensConfig/elements/border/primary/hover",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/border/primary/hover/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/primary/hover/value/initial",
                            "default": "{color.gray.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/primary/hover/value/dark",
                            "default": "{color.gray.800}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.200}",
                          "dark": "{color.gray.800}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.200}",
                        "dark": "{color.gray.800}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "static": {
                    "value": {
                      "initial": "{color.gray.100}",
                      "dark": "{color.gray.900}"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "{color.gray.200}",
                      "dark": "{color.gray.800}"
                    }
                  }
                }
              },
              "secondary": {
                "id": "#tokensConfig/elements/border/secondary",
                "properties": {
                  "static": {
                    "id": "#tokensConfig/elements/border/secondary/static",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/border/secondary/static/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/secondary/static/value/initial",
                            "default": "{color.gray.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/secondary/static/value/dark",
                            "default": "{color.gray.800}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.200}",
                          "dark": "{color.gray.800}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.200}",
                        "dark": "{color.gray.800}"
                      }
                    }
                  },
                  "hover": {
                    "id": "#tokensConfig/elements/border/secondary/hover",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/border/secondary/hover/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/secondary/hover/value/initial",
                            "default": ""
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/border/secondary/hover/value/dark",
                            "default": ""
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "",
                          "dark": ""
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "",
                        "dark": ""
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "static": {
                    "value": {
                      "initial": "{color.gray.200}",
                      "dark": "{color.gray.800}"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "",
                      "dark": ""
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "primary": {
                "static": {
                  "value": {
                    "initial": "{color.gray.100}",
                    "dark": "{color.gray.900}"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "{color.gray.200}",
                    "dark": "{color.gray.800}"
                  }
                }
              },
              "secondary": {
                "static": {
                  "value": {
                    "initial": "{color.gray.200}",
                    "dark": "{color.gray.800}"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "",
                    "dark": ""
                  }
                }
              }
            }
          },
          "surface": {
            "title": "Surfaces used in Elements.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType color",
              "@studioIcon fluent:surface-hub-20-filled"
            ],
            "id": "#tokensConfig/elements/surface",
            "properties": {
              "background": {
                "id": "#tokensConfig/elements/surface/background",
                "properties": {
                  "base": {
                    "id": "#tokensConfig/elements/surface/background/base",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/surface/background/base/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/surface/background/base/value/initial",
                            "default": "{color.gray.100}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/surface/background/base/value/dark",
                            "default": "{color.gray.900}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.100}",
                          "dark": "{color.gray.900}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.100}",
                        "dark": "{color.gray.900}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "base": {
                    "value": {
                      "initial": "{color.gray.100}",
                      "dark": "{color.gray.900}"
                    }
                  }
                }
              },
              "primary": {
                "id": "#tokensConfig/elements/surface/primary",
                "properties": {
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/surface/primary/backgroundColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/surface/primary/backgroundColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/surface/primary/backgroundColor/value/initial",
                            "default": "{color.gray.100}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/surface/primary/backgroundColor/value/dark",
                            "default": "{color.gray.900}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.100}",
                          "dark": "{color.gray.900}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.100}",
                        "dark": "{color.gray.900}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "backgroundColor": {
                    "value": {
                      "initial": "{color.gray.100}",
                      "dark": "{color.gray.900}"
                    }
                  }
                }
              },
              "secondary": {
                "id": "#tokensConfig/elements/surface/secondary",
                "properties": {
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/surface/secondary/backgroundColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/elements/surface/secondary/backgroundColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/elements/surface/secondary/backgroundColor/value/initial",
                            "default": "{color.gray.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/elements/surface/secondary/backgroundColor/value/dark",
                            "default": "{color.gray.800}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.200}",
                          "dark": "{color.gray.800}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.200}",
                        "dark": "{color.gray.800}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "backgroundColor": {
                    "value": {
                      "initial": "{color.gray.200}",
                      "dark": "{color.gray.800}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "background": {
                "base": {
                  "value": {
                    "initial": "{color.gray.100}",
                    "dark": "{color.gray.900}"
                  }
                }
              },
              "primary": {
                "backgroundColor": {
                  "value": {
                    "initial": "{color.gray.100}",
                    "dark": "{color.gray.900}"
                  }
                }
              },
              "secondary": {
                "backgroundColor": {
                  "value": {
                    "initial": "{color.gray.200}",
                    "dark": "{color.gray.800}"
                  }
                }
              }
            }
          },
          "state": {
            "title": "Color states used in Elements.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType color",
              "@studioIcon mdi:palette-advanced"
            ],
            "id": "#tokensConfig/elements/state",
            "properties": {
              "primary": {
                "id": "#tokensConfig/elements/state/primary",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/state/primary/color",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/primary/color/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/primary/color/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/color/primary/value/initial",
                                "default": "{color.primary.600}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/color/primary/value/dark",
                                "default": "{color.primary.400}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.primary.600}",
                              "dark": "{color.primary.400}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.primary.600}",
                            "dark": "{color.primary.400}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/primary/color/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/primary/color/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/color/secondary/value/initial",
                                "default": "{color.primary.700}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/color/secondary/value/dark",
                                "default": "{color.primary.200}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.primary.700}",
                              "dark": "{color.primary.200}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.primary.700}",
                            "dark": "{color.primary.200}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.primary.600}",
                          "dark": "{color.primary.400}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.primary.700}",
                          "dark": "{color.primary.200}"
                        }
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/state/primary/backgroundColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/primary/backgroundColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/primary/backgroundColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/backgroundColor/primary/value/initial",
                                "default": "{color.primary.50}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/backgroundColor/primary/value/dark",
                                "default": "{color.primary.900}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.primary.50}",
                              "dark": "{color.primary.900}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.primary.50}",
                            "dark": "{color.primary.900}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/primary/backgroundColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/primary/backgroundColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/backgroundColor/secondary/value/initial",
                                "default": "{color.primary.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/backgroundColor/secondary/value/dark",
                                "default": "{color.primary.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.primary.100}",
                              "dark": "{color.primary.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.primary.100}",
                            "dark": "{color.primary.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.primary.50}",
                          "dark": "{color.primary.900}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.primary.100}",
                          "dark": "{color.primary.800}"
                        }
                      }
                    }
                  },
                  "borderColor": {
                    "id": "#tokensConfig/elements/state/primary/borderColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/primary/borderColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/primary/borderColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/borderColor/primary/value/initial",
                                "default": "{color.primary.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/borderColor/primary/value/dark",
                                "default": "{color.primary.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.primary.100}",
                              "dark": "{color.primary.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.primary.100}",
                            "dark": "{color.primary.800}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/primary/borderColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/primary/borderColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/borderColor/secondary/value/initial",
                                "default": "{color.primary.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/primary/borderColor/secondary/value/dark",
                                "default": "{color.primary.700}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.primary.200}",
                              "dark": "{color.primary.700}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.primary.200}",
                            "dark": "{color.primary.700}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.primary.100}",
                          "dark": "{color.primary.800}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.primary.200}",
                          "dark": "{color.primary.700}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "primary": {
                      "value": {
                        "initial": "{color.primary.600}",
                        "dark": "{color.primary.400}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.primary.700}",
                        "dark": "{color.primary.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.primary.50}",
                        "dark": "{color.primary.900}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.primary.100}",
                        "dark": "{color.primary.800}"
                      }
                    }
                  },
                  "borderColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.primary.100}",
                        "dark": "{color.primary.800}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.primary.200}",
                        "dark": "{color.primary.700}"
                      }
                    }
                  }
                }
              },
              "info": {
                "id": "#tokensConfig/elements/state/info",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/state/info/color",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/info/color/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/info/color/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/color/primary/value/initial",
                                "default": "{color.blue.500}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/color/primary/value/dark",
                                "default": "{color.blue.400}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.blue.500}",
                              "dark": "{color.blue.400}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.blue.500}",
                            "dark": "{color.blue.400}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/info/color/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/info/color/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/color/secondary/value/initial",
                                "default": "{color.blue.600}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/color/secondary/value/dark",
                                "default": "{color.blue.200}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.blue.600}",
                              "dark": "{color.blue.200}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.blue.600}",
                            "dark": "{color.blue.200}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.blue.500}",
                          "dark": "{color.blue.400}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.blue.600}",
                          "dark": "{color.blue.200}"
                        }
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/state/info/backgroundColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/info/backgroundColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/info/backgroundColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/backgroundColor/primary/value/initial",
                                "default": "{color.blue.50}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/backgroundColor/primary/value/dark",
                                "default": "{color.blue.900}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.blue.50}",
                              "dark": "{color.blue.900}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.blue.50}",
                            "dark": "{color.blue.900}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/info/backgroundColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/info/backgroundColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/backgroundColor/secondary/value/initial",
                                "default": "{color.blue.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/backgroundColor/secondary/value/dark",
                                "default": "{color.blue.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.blue.100}",
                              "dark": "{color.blue.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.blue.100}",
                            "dark": "{color.blue.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.blue.50}",
                          "dark": "{color.blue.900}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.blue.100}",
                          "dark": "{color.blue.800}"
                        }
                      }
                    }
                  },
                  "borderColor": {
                    "id": "#tokensConfig/elements/state/info/borderColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/info/borderColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/info/borderColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/borderColor/primary/value/initial",
                                "default": "{color.blue.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/borderColor/primary/value/dark",
                                "default": "{color.blue.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.blue.100}",
                              "dark": "{color.blue.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.blue.100}",
                            "dark": "{color.blue.800}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/info/borderColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/info/borderColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/borderColor/secondary/value/initial",
                                "default": "{color.blue.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/info/borderColor/secondary/value/dark",
                                "default": "{color.blue.700}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.blue.200}",
                              "dark": "{color.blue.700}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.blue.200}",
                            "dark": "{color.blue.700}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.blue.100}",
                          "dark": "{color.blue.800}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.blue.200}",
                          "dark": "{color.blue.700}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "primary": {
                      "value": {
                        "initial": "{color.blue.500}",
                        "dark": "{color.blue.400}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.blue.600}",
                        "dark": "{color.blue.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.blue.50}",
                        "dark": "{color.blue.900}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.blue.100}",
                        "dark": "{color.blue.800}"
                      }
                    }
                  },
                  "borderColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.blue.100}",
                        "dark": "{color.blue.800}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.blue.200}",
                        "dark": "{color.blue.700}"
                      }
                    }
                  }
                }
              },
              "success": {
                "id": "#tokensConfig/elements/state/success",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/state/success/color",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/success/color/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/success/color/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/color/primary/value/initial",
                                "default": "{color.green.500}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/color/primary/value/dark",
                                "default": "{color.green.400}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.green.500}",
                              "dark": "{color.green.400}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.green.500}",
                            "dark": "{color.green.400}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/success/color/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/success/color/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/color/secondary/value/initial",
                                "default": "{color.green.600}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/color/secondary/value/dark",
                                "default": "{color.green.200}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.green.600}",
                              "dark": "{color.green.200}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.green.600}",
                            "dark": "{color.green.200}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.green.500}",
                          "dark": "{color.green.400}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.green.600}",
                          "dark": "{color.green.200}"
                        }
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/state/success/backgroundColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/success/backgroundColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/success/backgroundColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/backgroundColor/primary/value/initial",
                                "default": "{color.green.50}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/backgroundColor/primary/value/dark",
                                "default": "{color.green.900}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.green.50}",
                              "dark": "{color.green.900}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.green.50}",
                            "dark": "{color.green.900}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/success/backgroundColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/success/backgroundColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/backgroundColor/secondary/value/initial",
                                "default": "{color.green.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/backgroundColor/secondary/value/dark",
                                "default": "{color.green.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.green.100}",
                              "dark": "{color.green.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.green.100}",
                            "dark": "{color.green.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.green.50}",
                          "dark": "{color.green.900}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.green.100}",
                          "dark": "{color.green.800}"
                        }
                      }
                    }
                  },
                  "borderColor": {
                    "id": "#tokensConfig/elements/state/success/borderColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/success/borderColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/success/borderColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/borderColor/primary/value/initial",
                                "default": "{color.green.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/borderColor/primary/value/dark",
                                "default": "{color.green.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.green.100}",
                              "dark": "{color.green.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.green.100}",
                            "dark": "{color.green.800}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/success/borderColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/success/borderColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/borderColor/secondary/value/initial",
                                "default": "{color.green.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/success/borderColor/secondary/value/dark",
                                "default": "{color.green.700}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.green.200}",
                              "dark": "{color.green.700}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.green.200}",
                            "dark": "{color.green.700}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.green.100}",
                          "dark": "{color.green.800}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.green.200}",
                          "dark": "{color.green.700}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "primary": {
                      "value": {
                        "initial": "{color.green.500}",
                        "dark": "{color.green.400}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.green.600}",
                        "dark": "{color.green.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.green.50}",
                        "dark": "{color.green.900}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.green.100}",
                        "dark": "{color.green.800}"
                      }
                    }
                  },
                  "borderColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.green.100}",
                        "dark": "{color.green.800}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.green.200}",
                        "dark": "{color.green.700}"
                      }
                    }
                  }
                }
              },
              "warning": {
                "id": "#tokensConfig/elements/state/warning",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/state/warning/color",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/warning/color/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/warning/color/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/color/primary/value/initial",
                                "default": "{color.yellow.600}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/color/primary/value/dark",
                                "default": "{color.yellow.400}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.yellow.600}",
                              "dark": "{color.yellow.400}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.yellow.600}",
                            "dark": "{color.yellow.400}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/warning/color/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/warning/color/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/color/secondary/value/initial",
                                "default": "{color.yellow.700}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/color/secondary/value/dark",
                                "default": "{color.yellow.200}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.yellow.700}",
                              "dark": "{color.yellow.200}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.yellow.700}",
                            "dark": "{color.yellow.200}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.yellow.600}",
                          "dark": "{color.yellow.400}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.yellow.700}",
                          "dark": "{color.yellow.200}"
                        }
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/state/warning/backgroundColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/warning/backgroundColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/warning/backgroundColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/backgroundColor/primary/value/initial",
                                "default": "{color.yellow.50}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/backgroundColor/primary/value/dark",
                                "default": "{color.yellow.900}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.yellow.50}",
                              "dark": "{color.yellow.900}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.yellow.50}",
                            "dark": "{color.yellow.900}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/warning/backgroundColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/warning/backgroundColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/backgroundColor/secondary/value/initial",
                                "default": "{color.yellow.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/backgroundColor/secondary/value/dark",
                                "default": "{color.yellow.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.yellow.100}",
                              "dark": "{color.yellow.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.yellow.100}",
                            "dark": "{color.yellow.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.yellow.50}",
                          "dark": "{color.yellow.900}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.yellow.100}",
                          "dark": "{color.yellow.800}"
                        }
                      }
                    }
                  },
                  "borderColor": {
                    "id": "#tokensConfig/elements/state/warning/borderColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/warning/borderColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/warning/borderColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/borderColor/primary/value/initial",
                                "default": "{color.yellow.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/borderColor/primary/value/dark",
                                "default": "{color.yellow.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.yellow.100}",
                              "dark": "{color.yellow.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.yellow.100}",
                            "dark": "{color.yellow.800}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/warning/borderColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/warning/borderColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/borderColor/secondary/value/initial",
                                "default": "{color.yellow.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/warning/borderColor/secondary/value/dark",
                                "default": "{color.yellow.700}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.yellow.200}",
                              "dark": "{color.yellow.700}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.yellow.200}",
                            "dark": "{color.yellow.700}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.yellow.100}",
                          "dark": "{color.yellow.800}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.yellow.200}",
                          "dark": "{color.yellow.700}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "primary": {
                      "value": {
                        "initial": "{color.yellow.600}",
                        "dark": "{color.yellow.400}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.yellow.700}",
                        "dark": "{color.yellow.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.yellow.50}",
                        "dark": "{color.yellow.900}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.yellow.100}",
                        "dark": "{color.yellow.800}"
                      }
                    }
                  },
                  "borderColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.yellow.100}",
                        "dark": "{color.yellow.800}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.yellow.200}",
                        "dark": "{color.yellow.700}"
                      }
                    }
                  }
                }
              },
              "danger": {
                "id": "#tokensConfig/elements/state/danger",
                "properties": {
                  "color": {
                    "id": "#tokensConfig/elements/state/danger/color",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/danger/color/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/danger/color/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/color/primary/value/initial",
                                "default": "{color.red.500}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/color/primary/value/dark",
                                "default": "{color.red.300}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.red.500}",
                              "dark": "{color.red.300}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.red.500}",
                            "dark": "{color.red.300}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/danger/color/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/danger/color/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/color/secondary/value/initial",
                                "default": "{color.red.600}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/color/secondary/value/dark",
                                "default": "{color.red.200}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.red.600}",
                              "dark": "{color.red.200}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.red.600}",
                            "dark": "{color.red.200}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.red.500}",
                          "dark": "{color.red.300}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.red.600}",
                          "dark": "{color.red.200}"
                        }
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/elements/state/danger/backgroundColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/danger/backgroundColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/danger/backgroundColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/backgroundColor/primary/value/initial",
                                "default": "{color.red.50}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/backgroundColor/primary/value/dark",
                                "default": "{color.red.900}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.red.50}",
                              "dark": "{color.red.900}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.red.50}",
                            "dark": "{color.red.900}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/danger/backgroundColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/danger/backgroundColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/backgroundColor/secondary/value/initial",
                                "default": "{color.red.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/backgroundColor/secondary/value/dark",
                                "default": "{color.red.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.red.100}",
                              "dark": "{color.red.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.red.100}",
                            "dark": "{color.red.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.red.50}",
                          "dark": "{color.red.900}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.red.100}",
                          "dark": "{color.red.800}"
                        }
                      }
                    }
                  },
                  "borderColor": {
                    "id": "#tokensConfig/elements/state/danger/borderColor",
                    "properties": {
                      "primary": {
                        "id": "#tokensConfig/elements/state/danger/borderColor/primary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/danger/borderColor/primary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/borderColor/primary/value/initial",
                                "default": "{color.red.100}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/borderColor/primary/value/dark",
                                "default": "{color.red.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.red.100}",
                              "dark": "{color.red.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.red.100}",
                            "dark": "{color.red.800}"
                          }
                        }
                      },
                      "secondary": {
                        "id": "#tokensConfig/elements/state/danger/borderColor/secondary",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/elements/state/danger/borderColor/secondary/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/borderColor/secondary/value/initial",
                                "default": "{color.red.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/elements/state/danger/borderColor/secondary/value/dark",
                                "default": "{color.red.700}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.red.200}",
                              "dark": "{color.red.700}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.red.200}",
                            "dark": "{color.red.700}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "primary": {
                        "value": {
                          "initial": "{color.red.100}",
                          "dark": "{color.red.800}"
                        }
                      },
                      "secondary": {
                        "value": {
                          "initial": "{color.red.200}",
                          "dark": "{color.red.700}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "color": {
                    "primary": {
                      "value": {
                        "initial": "{color.red.500}",
                        "dark": "{color.red.300}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.red.600}",
                        "dark": "{color.red.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.red.50}",
                        "dark": "{color.red.900}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.red.100}",
                        "dark": "{color.red.800}"
                      }
                    }
                  },
                  "borderColor": {
                    "primary": {
                      "value": {
                        "initial": "{color.red.100}",
                        "dark": "{color.red.800}"
                      }
                    },
                    "secondary": {
                      "value": {
                        "initial": "{color.red.200}",
                        "dark": "{color.red.700}"
                      }
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "primary": {
                "color": {
                  "primary": {
                    "value": {
                      "initial": "{color.primary.600}",
                      "dark": "{color.primary.400}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.primary.700}",
                      "dark": "{color.primary.200}"
                    }
                  }
                },
                "backgroundColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.primary.50}",
                      "dark": "{color.primary.900}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.primary.100}",
                      "dark": "{color.primary.800}"
                    }
                  }
                },
                "borderColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.primary.100}",
                      "dark": "{color.primary.800}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.primary.200}",
                      "dark": "{color.primary.700}"
                    }
                  }
                }
              },
              "info": {
                "color": {
                  "primary": {
                    "value": {
                      "initial": "{color.blue.500}",
                      "dark": "{color.blue.400}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.blue.600}",
                      "dark": "{color.blue.200}"
                    }
                  }
                },
                "backgroundColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.blue.50}",
                      "dark": "{color.blue.900}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.blue.100}",
                      "dark": "{color.blue.800}"
                    }
                  }
                },
                "borderColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.blue.100}",
                      "dark": "{color.blue.800}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.blue.200}",
                      "dark": "{color.blue.700}"
                    }
                  }
                }
              },
              "success": {
                "color": {
                  "primary": {
                    "value": {
                      "initial": "{color.green.500}",
                      "dark": "{color.green.400}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.green.600}",
                      "dark": "{color.green.200}"
                    }
                  }
                },
                "backgroundColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.green.50}",
                      "dark": "{color.green.900}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.green.100}",
                      "dark": "{color.green.800}"
                    }
                  }
                },
                "borderColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.green.100}",
                      "dark": "{color.green.800}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.green.200}",
                      "dark": "{color.green.700}"
                    }
                  }
                }
              },
              "warning": {
                "color": {
                  "primary": {
                    "value": {
                      "initial": "{color.yellow.600}",
                      "dark": "{color.yellow.400}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.yellow.700}",
                      "dark": "{color.yellow.200}"
                    }
                  }
                },
                "backgroundColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.yellow.50}",
                      "dark": "{color.yellow.900}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.yellow.100}",
                      "dark": "{color.yellow.800}"
                    }
                  }
                },
                "borderColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.yellow.100}",
                      "dark": "{color.yellow.800}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.yellow.200}",
                      "dark": "{color.yellow.700}"
                    }
                  }
                }
              },
              "danger": {
                "color": {
                  "primary": {
                    "value": {
                      "initial": "{color.red.500}",
                      "dark": "{color.red.300}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.red.600}",
                      "dark": "{color.red.200}"
                    }
                  }
                },
                "backgroundColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.red.50}",
                      "dark": "{color.red.900}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.red.100}",
                      "dark": "{color.red.800}"
                    }
                  }
                },
                "borderColor": {
                  "primary": {
                    "value": {
                      "initial": "{color.red.100}",
                      "dark": "{color.red.800}"
                    }
                  },
                  "secondary": {
                    "value": {
                      "initial": "{color.red.200}",
                      "dark": "{color.red.700}"
                    }
                  }
                }
              }
            }
          }
        },
        "type": "object",
        "default": {
          "text": {
            "primary": {
              "color": {
                "static": {
                  "value": {
                    "initial": "{color.gray.900}",
                    "dark": "{color.gray.50}"
                  }
                },
                "hover": {}
              }
            },
            "secondary": {
              "color": {
                "static": {
                  "value": {
                    "initial": "{color.gray.500}",
                    "dark": "{color.gray.400}"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "{color.gray.700}",
                    "dark": "{color.gray.200}"
                  }
                }
              }
            }
          },
          "container": {
            "maxWidth": {
              "value": "80rem"
            },
            "padding": {
              "mobile": {
                "value": "{space.4}"
              },
              "xs": {
                "value": "{space.4}"
              },
              "sm": {
                "value": "{space.6}"
              },
              "md": {
                "value": "{space.6}"
              }
            }
          },
          "backdrop": {
            "filter": {
              "value": "saturate(200%) blur(20px)"
            },
            "background": {
              "value": {
                "initial": "#fffc",
                "dark": "#0c0d0ccc"
              }
            }
          },
          "border": {
            "primary": {
              "static": {
                "value": {
                  "initial": "{color.gray.100}",
                  "dark": "{color.gray.900}"
                }
              },
              "hover": {
                "value": {
                  "initial": "{color.gray.200}",
                  "dark": "{color.gray.800}"
                }
              }
            },
            "secondary": {
              "static": {
                "value": {
                  "initial": "{color.gray.200}",
                  "dark": "{color.gray.800}"
                }
              },
              "hover": {
                "value": {
                  "initial": "",
                  "dark": ""
                }
              }
            }
          },
          "surface": {
            "background": {
              "base": {
                "value": {
                  "initial": "{color.gray.100}",
                  "dark": "{color.gray.900}"
                }
              }
            },
            "primary": {
              "backgroundColor": {
                "value": {
                  "initial": "{color.gray.100}",
                  "dark": "{color.gray.900}"
                }
              }
            },
            "secondary": {
              "backgroundColor": {
                "value": {
                  "initial": "{color.gray.200}",
                  "dark": "{color.gray.800}"
                }
              }
            }
          },
          "state": {
            "primary": {
              "color": {
                "primary": {
                  "value": {
                    "initial": "{color.primary.600}",
                    "dark": "{color.primary.400}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.primary.700}",
                    "dark": "{color.primary.200}"
                  }
                }
              },
              "backgroundColor": {
                "primary": {
                  "value": {
                    "initial": "{color.primary.50}",
                    "dark": "{color.primary.900}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.primary.100}",
                    "dark": "{color.primary.800}"
                  }
                }
              },
              "borderColor": {
                "primary": {
                  "value": {
                    "initial": "{color.primary.100}",
                    "dark": "{color.primary.800}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.primary.200}",
                    "dark": "{color.primary.700}"
                  }
                }
              }
            },
            "info": {
              "color": {
                "primary": {
                  "value": {
                    "initial": "{color.blue.500}",
                    "dark": "{color.blue.400}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.blue.600}",
                    "dark": "{color.blue.200}"
                  }
                }
              },
              "backgroundColor": {
                "primary": {
                  "value": {
                    "initial": "{color.blue.50}",
                    "dark": "{color.blue.900}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.blue.100}",
                    "dark": "{color.blue.800}"
                  }
                }
              },
              "borderColor": {
                "primary": {
                  "value": {
                    "initial": "{color.blue.100}",
                    "dark": "{color.blue.800}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.blue.200}",
                    "dark": "{color.blue.700}"
                  }
                }
              }
            },
            "success": {
              "color": {
                "primary": {
                  "value": {
                    "initial": "{color.green.500}",
                    "dark": "{color.green.400}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.green.600}",
                    "dark": "{color.green.200}"
                  }
                }
              },
              "backgroundColor": {
                "primary": {
                  "value": {
                    "initial": "{color.green.50}",
                    "dark": "{color.green.900}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.green.100}",
                    "dark": "{color.green.800}"
                  }
                }
              },
              "borderColor": {
                "primary": {
                  "value": {
                    "initial": "{color.green.100}",
                    "dark": "{color.green.800}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.green.200}",
                    "dark": "{color.green.700}"
                  }
                }
              }
            },
            "warning": {
              "color": {
                "primary": {
                  "value": {
                    "initial": "{color.yellow.600}",
                    "dark": "{color.yellow.400}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.yellow.700}",
                    "dark": "{color.yellow.200}"
                  }
                }
              },
              "backgroundColor": {
                "primary": {
                  "value": {
                    "initial": "{color.yellow.50}",
                    "dark": "{color.yellow.900}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.yellow.100}",
                    "dark": "{color.yellow.800}"
                  }
                }
              },
              "borderColor": {
                "primary": {
                  "value": {
                    "initial": "{color.yellow.100}",
                    "dark": "{color.yellow.800}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.yellow.200}",
                    "dark": "{color.yellow.700}"
                  }
                }
              }
            },
            "danger": {
              "color": {
                "primary": {
                  "value": {
                    "initial": "{color.red.500}",
                    "dark": "{color.red.300}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.red.600}",
                    "dark": "{color.red.200}"
                  }
                }
              },
              "backgroundColor": {
                "primary": {
                  "value": {
                    "initial": "{color.red.50}",
                    "dark": "{color.red.900}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.red.100}",
                    "dark": "{color.red.800}"
                  }
                }
              },
              "borderColor": {
                "primary": {
                  "value": {
                    "initial": "{color.red.100}",
                    "dark": "{color.red.800}"
                  }
                },
                "secondary": {
                  "value": {
                    "initial": "{color.red.200}",
                    "dark": "{color.red.700}"
                  }
                }
              }
            }
          }
        }
      },
      "typography": {
        "title": "All the configurable tokens for your Typography.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType color",
          "@studioIcon material-symbols:article"
        ],
        "id": "#tokensConfig/typography",
        "properties": {
          "body": {
            "id": "#tokensConfig/typography/body",
            "properties": {
              "color": {
                "id": "#tokensConfig/typography/body/color",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/typography/body/color/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/typography/body/color/value/initial",
                        "default": "{color.black}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/typography/body/color/value/dark",
                        "default": "{color.white}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{color.black}",
                      "dark": "{color.white}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{color.black}",
                    "dark": "{color.white}"
                  }
                }
              },
              "backgroundColor": {
                "id": "#tokensConfig/typography/body/backgroundColor",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/typography/body/backgroundColor/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/typography/body/backgroundColor/value/initial",
                        "default": "{color.white}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/typography/body/backgroundColor/value/dark",
                        "default": "{color.black}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{color.white}",
                      "dark": "{color.black}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{color.white}",
                    "dark": "{color.black}"
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "color": {
                "value": {
                  "initial": "{color.black}",
                  "dark": "{color.white}"
                }
              },
              "backgroundColor": {
                "value": {
                  "initial": "{color.white}",
                  "dark": "{color.black}"
                }
              }
            }
          },
          "verticalMargin": {
            "title": "Vertical spacings between paragraphs.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType size",
              "@studioIcon mingcute:line-height-line"
            ],
            "id": "#tokensConfig/typography/verticalMargin",
            "properties": {
              "sm": {
                "id": "#tokensConfig/typography/verticalMargin/sm",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/verticalMargin/sm/value",
                    "default": "16px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "16px"
                }
              },
              "base": {
                "id": "#tokensConfig/typography/verticalMargin/base",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/verticalMargin/base/value",
                    "default": "24px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "24px"
                }
              }
            },
            "type": "object",
            "default": {
              "sm": {
                "value": "16px"
              },
              "base": {
                "value": "24px"
              }
            }
          },
          "letterSpacing": {
            "title": "Horizontal spacings between letters.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType size",
              "@studioIcon mingcute:letter-spacing-line"
            ],
            "id": "#tokensConfig/typography/letterSpacing",
            "properties": {
              "tight": {
                "id": "#tokensConfig/typography/letterSpacing/tight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/letterSpacing/tight/value",
                    "default": "-0.025em"
                  }
                },
                "type": "object",
                "default": {
                  "value": "-0.025em"
                }
              },
              "wide": {
                "id": "#tokensConfig/typography/letterSpacing/wide",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/letterSpacing/wide/value",
                    "default": "0.025em"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0.025em"
                }
              }
            },
            "type": "object",
            "default": {
              "tight": {
                "value": "-0.025em"
              },
              "wide": {
                "value": "0.025em"
              }
            }
          },
          "fontSize": {
            "title": "Horizontal spacings between letters.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType font-size",
              "@studioIcon mingcute:font-size-fill"
            ],
            "id": "#tokensConfig/typography/fontSize",
            "properties": {
              "xs": {
                "id": "#tokensConfig/typography/fontSize/xs",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/xs/value",
                    "default": "12px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "12px"
                }
              },
              "sm": {
                "id": "#tokensConfig/typography/fontSize/sm",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/sm/value",
                    "default": "14px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "14px"
                }
              },
              "base": {
                "id": "#tokensConfig/typography/fontSize/base",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/base/value",
                    "default": "16px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "16px"
                }
              },
              "lg": {
                "id": "#tokensConfig/typography/fontSize/lg",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/lg/value",
                    "default": "18px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "18px"
                }
              },
              "xl": {
                "id": "#tokensConfig/typography/fontSize/xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/xl/value",
                    "default": "20px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "20px"
                }
              },
              "2xl": {
                "id": "#tokensConfig/typography/fontSize/2xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/2xl/value",
                    "default": "24px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "24px"
                }
              },
              "3xl": {
                "id": "#tokensConfig/typography/fontSize/3xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/3xl/value",
                    "default": "30px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "30px"
                }
              },
              "4xl": {
                "id": "#tokensConfig/typography/fontSize/4xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/4xl/value",
                    "default": "36px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "36px"
                }
              },
              "5xl": {
                "id": "#tokensConfig/typography/fontSize/5xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/5xl/value",
                    "default": "48px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "48px"
                }
              },
              "6xl": {
                "id": "#tokensConfig/typography/fontSize/6xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/6xl/value",
                    "default": "60px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "60px"
                }
              },
              "7xl": {
                "id": "#tokensConfig/typography/fontSize/7xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/7xl/value",
                    "default": "72px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "72px"
                }
              },
              "8xl": {
                "id": "#tokensConfig/typography/fontSize/8xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/8xl/value",
                    "default": "96px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "96px"
                }
              },
              "9xl": {
                "id": "#tokensConfig/typography/fontSize/9xl",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontSize/9xl/value",
                    "default": "128px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "128px"
                }
              }
            },
            "type": "object",
            "default": {
              "xs": {
                "value": "12px"
              },
              "sm": {
                "value": "14px"
              },
              "base": {
                "value": "16px"
              },
              "lg": {
                "value": "18px"
              },
              "xl": {
                "value": "20px"
              },
              "2xl": {
                "value": "24px"
              },
              "3xl": {
                "value": "30px"
              },
              "4xl": {
                "value": "36px"
              },
              "5xl": {
                "value": "48px"
              },
              "6xl": {
                "value": "60px"
              },
              "7xl": {
                "value": "72px"
              },
              "8xl": {
                "value": "96px"
              },
              "9xl": {
                "value": "128px"
              }
            }
          },
          "fontWeight": {
            "title": "Font weights used in typography.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType font-size",
              "@studioIcon mingcute:bold-fill"
            ],
            "id": "#tokensConfig/typography/fontWeight",
            "properties": {
              "thin": {
                "id": "#tokensConfig/typography/fontWeight/thin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/thin/value",
                    "default": "100"
                  }
                },
                "type": "object",
                "default": {
                  "value": "100"
                }
              },
              "extralight": {
                "id": "#tokensConfig/typography/fontWeight/extralight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/extralight/value",
                    "default": "200"
                  }
                },
                "type": "object",
                "default": {
                  "value": "200"
                }
              },
              "light": {
                "id": "#tokensConfig/typography/fontWeight/light",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/light/value",
                    "default": "300"
                  }
                },
                "type": "object",
                "default": {
                  "value": "300"
                }
              },
              "normal": {
                "id": "#tokensConfig/typography/fontWeight/normal",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/normal/value",
                    "default": "400"
                  }
                },
                "type": "object",
                "default": {
                  "value": "400"
                }
              },
              "medium": {
                "id": "#tokensConfig/typography/fontWeight/medium",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/medium/value",
                    "default": "500"
                  }
                },
                "type": "object",
                "default": {
                  "value": "500"
                }
              },
              "semibold": {
                "id": "#tokensConfig/typography/fontWeight/semibold",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/semibold/value",
                    "default": "600"
                  }
                },
                "type": "object",
                "default": {
                  "value": "600"
                }
              },
              "bold": {
                "id": "#tokensConfig/typography/fontWeight/bold",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/bold/value",
                    "default": "700"
                  }
                },
                "type": "object",
                "default": {
                  "value": "700"
                }
              },
              "extrabold": {
                "id": "#tokensConfig/typography/fontWeight/extrabold",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/extrabold/value",
                    "default": "800"
                  }
                },
                "type": "object",
                "default": {
                  "value": "800"
                }
              },
              "black": {
                "id": "#tokensConfig/typography/fontWeight/black",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/fontWeight/black/value",
                    "default": "900"
                  }
                },
                "type": "object",
                "default": {
                  "value": "900"
                }
              }
            },
            "type": "object",
            "default": {
              "thin": {
                "value": "100"
              },
              "extralight": {
                "value": "200"
              },
              "light": {
                "value": "300"
              },
              "normal": {
                "value": "400"
              },
              "medium": {
                "value": "500"
              },
              "semibold": {
                "value": "600"
              },
              "bold": {
                "value": "700"
              },
              "extrabold": {
                "value": "800"
              },
              "black": {
                "value": "900"
              }
            }
          },
          "lead": {
            "title": "Line heights used in your typography.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType font-size",
              "@studioIcon material-symbols:height-rounded"
            ],
            "id": "#tokensConfig/typography/lead",
            "properties": {
              "1": {
                "id": "#tokensConfig/typography/lead/1",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/1/value",
                    "default": ".025rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": ".025rem"
                }
              },
              "2": {
                "id": "#tokensConfig/typography/lead/2",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/2/value",
                    "default": ".5rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": ".5rem"
                }
              },
              "3": {
                "id": "#tokensConfig/typography/lead/3",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/3/value",
                    "default": ".75rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": ".75rem"
                }
              },
              "4": {
                "id": "#tokensConfig/typography/lead/4",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/4/value",
                    "default": "1rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1rem"
                }
              },
              "5": {
                "id": "#tokensConfig/typography/lead/5",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/5/value",
                    "default": "1.25rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.25rem"
                }
              },
              "6": {
                "id": "#tokensConfig/typography/lead/6",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/6/value",
                    "default": "1.5rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.5rem"
                }
              },
              "7": {
                "id": "#tokensConfig/typography/lead/7",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/7/value",
                    "default": "1.75rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.75rem"
                }
              },
              "8": {
                "id": "#tokensConfig/typography/lead/8",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/8/value",
                    "default": "2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "2rem"
                }
              },
              "9": {
                "id": "#tokensConfig/typography/lead/9",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/9/value",
                    "default": "2.25rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "2.25rem"
                }
              },
              "10": {
                "id": "#tokensConfig/typography/lead/10",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/10/value",
                    "default": "2.5rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "2.5rem"
                }
              },
              "none": {
                "id": "#tokensConfig/typography/lead/none",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/none/value",
                    "default": "1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1"
                }
              },
              "tight": {
                "id": "#tokensConfig/typography/lead/tight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/tight/value",
                    "default": "1.25"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.25"
                }
              },
              "snug": {
                "id": "#tokensConfig/typography/lead/snug",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/snug/value",
                    "default": "1.375"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.375"
                }
              },
              "normal": {
                "id": "#tokensConfig/typography/lead/normal",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/normal/value",
                    "default": "1.5"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.5"
                }
              },
              "relaxed": {
                "id": "#tokensConfig/typography/lead/relaxed",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/relaxed/value",
                    "default": "1.625"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1.625"
                }
              },
              "loose": {
                "id": "#tokensConfig/typography/lead/loose",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/lead/loose/value",
                    "default": "2"
                  }
                },
                "type": "object",
                "default": {
                  "value": "2"
                }
              }
            },
            "type": "object",
            "default": {
              "1": {
                "value": ".025rem"
              },
              "2": {
                "value": ".5rem"
              },
              "3": {
                "value": ".75rem"
              },
              "4": {
                "value": "1rem"
              },
              "5": {
                "value": "1.25rem"
              },
              "6": {
                "value": "1.5rem"
              },
              "7": {
                "value": "1.75rem"
              },
              "8": {
                "value": "2rem"
              },
              "9": {
                "value": "2.25rem"
              },
              "10": {
                "value": "2.5rem"
              },
              "none": {
                "value": "1"
              },
              "tight": {
                "value": "1.25"
              },
              "snug": {
                "value": "1.375"
              },
              "normal": {
                "value": "1.5"
              },
              "relaxed": {
                "value": "1.625"
              },
              "loose": {
                "value": "2"
              }
            }
          },
          "font": {
            "title": "Your typography fonts",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType font",
              "@studioIcon material-symbols:font-download-rounded"
            ],
            "id": "#tokensConfig/typography/font",
            "properties": {
              "display": {
                "id": "#tokensConfig/typography/font/display",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/font/display/value",
                    "default": "{font.sans}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{font.sans}"
                }
              },
              "body": {
                "id": "#tokensConfig/typography/font/body",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/font/body/value",
                    "default": "{font.sans}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{font.sans}"
                }
              },
              "code": {
                "id": "#tokensConfig/typography/font/code",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/typography/font/code/value",
                    "default": "{font.mono}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{font.mono}"
                }
              }
            },
            "type": "object",
            "default": {
              "display": {
                "value": "{font.sans}"
              },
              "body": {
                "value": "{font.sans}"
              },
              "code": {
                "value": "{font.mono}"
              }
            }
          },
          "color": {
            "title": "Your typography color palette.",
            "tags": [
              "@studioInput design-token",
              "@studioInputTokenType color",
              "@studioIcon ph:palette"
            ],
            "id": "#tokensConfig/typography/color",
            "properties": {
              "primary": {
                "id": "#tokensConfig/typography/color/primary",
                "properties": {
                  "50": {
                    "id": "#tokensConfig/typography/color/primary/50",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/50/value",
                        "default": "{color.primary.50}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.50}"
                    }
                  },
                  "100": {
                    "id": "#tokensConfig/typography/color/primary/100",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/100/value",
                        "default": "{color.primary.100}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.100}"
                    }
                  },
                  "200": {
                    "id": "#tokensConfig/typography/color/primary/200",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/200/value",
                        "default": "{color.primary.200}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.200}"
                    }
                  },
                  "300": {
                    "id": "#tokensConfig/typography/color/primary/300",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/300/value",
                        "default": "{color.primary.300}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.300}"
                    }
                  },
                  "400": {
                    "id": "#tokensConfig/typography/color/primary/400",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/400/value",
                        "default": "{color.primary.400}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.400}"
                    }
                  },
                  "500": {
                    "id": "#tokensConfig/typography/color/primary/500",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/500/value",
                        "default": "{color.primary.500}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.500}"
                    }
                  },
                  "600": {
                    "id": "#tokensConfig/typography/color/primary/600",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/600/value",
                        "default": "{color.primary.600}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.600}"
                    }
                  },
                  "700": {
                    "id": "#tokensConfig/typography/color/primary/700",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/700/value",
                        "default": "{color.primary.700}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.700}"
                    }
                  },
                  "800": {
                    "id": "#tokensConfig/typography/color/primary/800",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/800/value",
                        "default": "{color.primary.800}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.800}"
                    }
                  },
                  "900": {
                    "id": "#tokensConfig/typography/color/primary/900",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/primary/900/value",
                        "default": "{color.primary.900}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.primary.900}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "50": {
                    "value": "{color.primary.50}"
                  },
                  "100": {
                    "value": "{color.primary.100}"
                  },
                  "200": {
                    "value": "{color.primary.200}"
                  },
                  "300": {
                    "value": "{color.primary.300}"
                  },
                  "400": {
                    "value": "{color.primary.400}"
                  },
                  "500": {
                    "value": "{color.primary.500}"
                  },
                  "600": {
                    "value": "{color.primary.600}"
                  },
                  "700": {
                    "value": "{color.primary.700}"
                  },
                  "800": {
                    "value": "{color.primary.800}"
                  },
                  "900": {
                    "value": "{color.primary.900}"
                  }
                }
              },
              "secondary": {
                "id": "#tokensConfig/typography/color/secondary",
                "properties": {
                  "50": {
                    "id": "#tokensConfig/typography/color/secondary/50",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/50/value",
                        "default": "{color.gray.50}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.50}"
                    }
                  },
                  "100": {
                    "id": "#tokensConfig/typography/color/secondary/100",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/100/value",
                        "default": "{color.gray.100}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.100}"
                    }
                  },
                  "200": {
                    "id": "#tokensConfig/typography/color/secondary/200",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/200/value",
                        "default": "{color.gray.200}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.200}"
                    }
                  },
                  "300": {
                    "id": "#tokensConfig/typography/color/secondary/300",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/300/value",
                        "default": "{color.gray.300}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.300}"
                    }
                  },
                  "400": {
                    "id": "#tokensConfig/typography/color/secondary/400",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/400/value",
                        "default": "{color.gray.400}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.400}"
                    }
                  },
                  "500": {
                    "id": "#tokensConfig/typography/color/secondary/500",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/500/value",
                        "default": "{color.gray.500}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.500}"
                    }
                  },
                  "600": {
                    "id": "#tokensConfig/typography/color/secondary/600",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/600/value",
                        "default": "{color.gray.600}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.600}"
                    }
                  },
                  "700": {
                    "id": "#tokensConfig/typography/color/secondary/700",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/700/value",
                        "default": "{color.gray.700}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.700}"
                    }
                  },
                  "800": {
                    "id": "#tokensConfig/typography/color/secondary/800",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/800/value",
                        "default": "{color.gray.800}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.800}"
                    }
                  },
                  "900": {
                    "id": "#tokensConfig/typography/color/secondary/900",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/typography/color/secondary/900/value",
                        "default": "{color.gray.900}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{color.gray.900}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "50": {
                    "value": "{color.gray.50}"
                  },
                  "100": {
                    "value": "{color.gray.100}"
                  },
                  "200": {
                    "value": "{color.gray.200}"
                  },
                  "300": {
                    "value": "{color.gray.300}"
                  },
                  "400": {
                    "value": "{color.gray.400}"
                  },
                  "500": {
                    "value": "{color.gray.500}"
                  },
                  "600": {
                    "value": "{color.gray.600}"
                  },
                  "700": {
                    "value": "{color.gray.700}"
                  },
                  "800": {
                    "value": "{color.gray.800}"
                  },
                  "900": {
                    "value": "{color.gray.900}"
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "primary": {
                "50": {
                  "value": "{color.primary.50}"
                },
                "100": {
                  "value": "{color.primary.100}"
                },
                "200": {
                  "value": "{color.primary.200}"
                },
                "300": {
                  "value": "{color.primary.300}"
                },
                "400": {
                  "value": "{color.primary.400}"
                },
                "500": {
                  "value": "{color.primary.500}"
                },
                "600": {
                  "value": "{color.primary.600}"
                },
                "700": {
                  "value": "{color.primary.700}"
                },
                "800": {
                  "value": "{color.primary.800}"
                },
                "900": {
                  "value": "{color.primary.900}"
                }
              },
              "secondary": {
                "50": {
                  "value": "{color.gray.50}"
                },
                "100": {
                  "value": "{color.gray.100}"
                },
                "200": {
                  "value": "{color.gray.200}"
                },
                "300": {
                  "value": "{color.gray.300}"
                },
                "400": {
                  "value": "{color.gray.400}"
                },
                "500": {
                  "value": "{color.gray.500}"
                },
                "600": {
                  "value": "{color.gray.600}"
                },
                "700": {
                  "value": "{color.gray.700}"
                },
                "800": {
                  "value": "{color.gray.800}"
                },
                "900": {
                  "value": "{color.gray.900}"
                }
              }
            }
          }
        },
        "type": "object",
        "default": {
          "body": {
            "color": {
              "value": {
                "initial": "{color.black}",
                "dark": "{color.white}"
              }
            },
            "backgroundColor": {
              "value": {
                "initial": "{color.white}",
                "dark": "{color.black}"
              }
            }
          },
          "verticalMargin": {
            "sm": {
              "value": "16px"
            },
            "base": {
              "value": "24px"
            }
          },
          "letterSpacing": {
            "tight": {
              "value": "-0.025em"
            },
            "wide": {
              "value": "0.025em"
            }
          },
          "fontSize": {
            "xs": {
              "value": "12px"
            },
            "sm": {
              "value": "14px"
            },
            "base": {
              "value": "16px"
            },
            "lg": {
              "value": "18px"
            },
            "xl": {
              "value": "20px"
            },
            "2xl": {
              "value": "24px"
            },
            "3xl": {
              "value": "30px"
            },
            "4xl": {
              "value": "36px"
            },
            "5xl": {
              "value": "48px"
            },
            "6xl": {
              "value": "60px"
            },
            "7xl": {
              "value": "72px"
            },
            "8xl": {
              "value": "96px"
            },
            "9xl": {
              "value": "128px"
            }
          },
          "fontWeight": {
            "thin": {
              "value": "100"
            },
            "extralight": {
              "value": "200"
            },
            "light": {
              "value": "300"
            },
            "normal": {
              "value": "400"
            },
            "medium": {
              "value": "500"
            },
            "semibold": {
              "value": "600"
            },
            "bold": {
              "value": "700"
            },
            "extrabold": {
              "value": "800"
            },
            "black": {
              "value": "900"
            }
          },
          "lead": {
            "1": {
              "value": ".025rem"
            },
            "2": {
              "value": ".5rem"
            },
            "3": {
              "value": ".75rem"
            },
            "4": {
              "value": "1rem"
            },
            "5": {
              "value": "1.25rem"
            },
            "6": {
              "value": "1.5rem"
            },
            "7": {
              "value": "1.75rem"
            },
            "8": {
              "value": "2rem"
            },
            "9": {
              "value": "2.25rem"
            },
            "10": {
              "value": "2.5rem"
            },
            "none": {
              "value": "1"
            },
            "tight": {
              "value": "1.25"
            },
            "snug": {
              "value": "1.375"
            },
            "normal": {
              "value": "1.5"
            },
            "relaxed": {
              "value": "1.625"
            },
            "loose": {
              "value": "2"
            }
          },
          "font": {
            "display": {
              "value": "{font.sans}"
            },
            "body": {
              "value": "{font.sans}"
            },
            "code": {
              "value": "{font.mono}"
            }
          },
          "color": {
            "primary": {
              "50": {
                "value": "{color.primary.50}"
              },
              "100": {
                "value": "{color.primary.100}"
              },
              "200": {
                "value": "{color.primary.200}"
              },
              "300": {
                "value": "{color.primary.300}"
              },
              "400": {
                "value": "{color.primary.400}"
              },
              "500": {
                "value": "{color.primary.500}"
              },
              "600": {
                "value": "{color.primary.600}"
              },
              "700": {
                "value": "{color.primary.700}"
              },
              "800": {
                "value": "{color.primary.800}"
              },
              "900": {
                "value": "{color.primary.900}"
              }
            },
            "secondary": {
              "50": {
                "value": "{color.gray.50}"
              },
              "100": {
                "value": "{color.gray.100}"
              },
              "200": {
                "value": "{color.gray.200}"
              },
              "300": {
                "value": "{color.gray.300}"
              },
              "400": {
                "value": "{color.gray.400}"
              },
              "500": {
                "value": "{color.gray.500}"
              },
              "600": {
                "value": "{color.gray.600}"
              },
              "700": {
                "value": "{color.gray.700}"
              },
              "800": {
                "value": "{color.gray.800}"
              },
              "900": {
                "value": "{color.gray.900}"
              }
            }
          }
        }
      },
      "prose": {
        "title": "All the configurable tokens for your Prose components.",
        "tags": [
          "@studioInput design-token",
          "@studioInputTokenType font-size",
          "@studioIcon lucide:component"
        ],
        "id": "#tokensConfig/prose",
        "properties": {
          "p": {
            "id": "#tokensConfig/prose/p",
            "properties": {
              "fontSize": {
                "id": "#tokensConfig/prose/p/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/p/fontSize/value",
                    "default": "{typography.fontSize.base}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.base}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/p/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/p/lineHeight/value",
                    "default": "{typography.lead.normal}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.normal}"
                }
              },
              "margin": {
                "id": "#tokensConfig/prose/p/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/p/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              },
              "br": {
                "id": "#tokensConfig/prose/p/br",
                "properties": {
                  "margin": {
                    "id": "#tokensConfig/prose/p/br/margin",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/p/br/margin/value",
                        "default": "{typography.verticalMargin.base} 0 0 0"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{typography.verticalMargin.base} 0 0 0"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "margin": {
                    "value": "{typography.verticalMargin.base} 0 0 0"
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "fontSize": {
                "value": "{typography.fontSize.base}"
              },
              "lineHeight": {
                "value": "{typography.lead.normal}"
              },
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "br": {
                "margin": {
                  "value": "{typography.verticalMargin.base} 0 0 0"
                }
              }
            }
          },
          "h1": {
            "id": "#tokensConfig/prose/h1",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/h1/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h1/margin/value",
                    "default": "0 0 2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0 0 2rem"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/h1/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h1/fontSize/value",
                    "default": "{typography.fontSize.5xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.5xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/h1/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h1/lineHeight/value",
                    "default": "{typography.lead.tight}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.tight}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/h1/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h1/fontWeight/value",
                    "default": "{typography.fontWeight.bold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.bold}"
                }
              },
              "letterSpacing": {
                "id": "#tokensConfig/prose/h1/letterSpacing",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h1/letterSpacing/value",
                    "default": "{typography.letterSpacing.tight}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.letterSpacing.tight}"
                }
              },
              "iconSize": {
                "id": "#tokensConfig/prose/h1/iconSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h1/iconSize/value",
                    "default": "{typography.fontSize.3xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.3xl}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "0 0 2rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.5xl}"
              },
              "lineHeight": {
                "value": "{typography.lead.tight}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.bold}"
              },
              "letterSpacing": {
                "value": "{typography.letterSpacing.tight}"
              },
              "iconSize": {
                "value": "{typography.fontSize.3xl}"
              }
            }
          },
          "h2": {
            "id": "#tokensConfig/prose/h2",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/h2/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h2/margin/value",
                    "default": "3rem 0 2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "3rem 0 2rem"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/h2/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h2/fontSize/value",
                    "default": "{typography.fontSize.4xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.4xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/h2/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h2/lineHeight/value",
                    "default": "{typography.lead.tight}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.tight}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/h2/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h2/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              },
              "letterSpacing": {
                "id": "#tokensConfig/prose/h2/letterSpacing",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h2/letterSpacing/value",
                    "default": "{typography.letterSpacing.tight}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.letterSpacing.tight}"
                }
              },
              "iconSize": {
                "id": "#tokensConfig/prose/h2/iconSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h2/iconSize/value",
                    "default": "{typography.fontSize.2xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.2xl}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "3rem 0 2rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.4xl}"
              },
              "lineHeight": {
                "value": "{typography.lead.tight}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              },
              "letterSpacing": {
                "value": "{typography.letterSpacing.tight}"
              },
              "iconSize": {
                "value": "{typography.fontSize.2xl}"
              }
            }
          },
          "h3": {
            "id": "#tokensConfig/prose/h3",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/h3/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h3/margin/value",
                    "default": "3rem 0 2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "3rem 0 2rem"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/h3/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h3/fontSize/value",
                    "default": "{typography.fontSize.3xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.3xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/h3/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h3/lineHeight/value",
                    "default": "{typography.lead.snug}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.snug}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/h3/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h3/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              },
              "letterSpacing": {
                "id": "#tokensConfig/prose/h3/letterSpacing",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h3/letterSpacing/value",
                    "default": "{typography.letterSpacing.tight}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.letterSpacing.tight}"
                }
              },
              "iconSize": {
                "id": "#tokensConfig/prose/h3/iconSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h3/iconSize/value",
                    "default": "{typography.fontSize.xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.xl}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "3rem 0 2rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.3xl}"
              },
              "lineHeight": {
                "value": "{typography.lead.snug}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              },
              "letterSpacing": {
                "value": "{typography.letterSpacing.tight}"
              },
              "iconSize": {
                "value": "{typography.fontSize.xl}"
              }
            }
          },
          "h4": {
            "id": "#tokensConfig/prose/h4",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/h4/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h4/margin/value",
                    "default": "3rem 0 2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "3rem 0 2rem"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/h4/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h4/fontSize/value",
                    "default": "{typography.fontSize.2xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.2xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/h4/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h4/lineHeight/value",
                    "default": "{typography.lead.snug}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.snug}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/h4/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h4/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              },
              "letterSpacing": {
                "id": "#tokensConfig/prose/h4/letterSpacing",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h4/letterSpacing/value",
                    "default": "{typography.letterSpacing.tight}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.letterSpacing.tight}"
                }
              },
              "iconSize": {
                "id": "#tokensConfig/prose/h4/iconSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h4/iconSize/value",
                    "default": "{typography.fontSize.lg}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.lg}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "3rem 0 2rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.2xl}"
              },
              "lineHeight": {
                "value": "{typography.lead.snug}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              },
              "letterSpacing": {
                "value": "{typography.letterSpacing.tight}"
              },
              "iconSize": {
                "value": "{typography.fontSize.lg}"
              }
            }
          },
          "h5": {
            "id": "#tokensConfig/prose/h5",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/h5/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h5/margin/value",
                    "default": "3rem 0 2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "3rem 0 2rem"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/h5/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h5/fontSize/value",
                    "default": "{typography.fontSize.xl}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.xl}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/h5/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h5/lineHeight/value",
                    "default": "{typography.lead.snug}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.snug}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/h5/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h5/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              },
              "iconSize": {
                "id": "#tokensConfig/prose/h5/iconSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h5/iconSize/value",
                    "default": "{typography.fontSize.lg}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.lg}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "3rem 0 2rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.xl}"
              },
              "lineHeight": {
                "value": "{typography.lead.snug}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              },
              "iconSize": {
                "value": "{typography.fontSize.lg}"
              }
            }
          },
          "h6": {
            "id": "#tokensConfig/prose/h6",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/h6/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h6/margin/value",
                    "default": "3rem 0 2rem"
                  }
                },
                "type": "object",
                "default": {
                  "value": "3rem 0 2rem"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/h6/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h6/fontSize/value",
                    "default": "{typography.fontSize.lg}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.lg}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/h6/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h6/lineHeight/value",
                    "default": "{typography.lead.normal}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.normal}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/h6/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h6/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              },
              "iconSize": {
                "id": "#tokensConfig/prose/h6/iconSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/h6/iconSize/value",
                    "default": "{typography.fontSize.base}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.base}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "3rem 0 2rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.lg}"
              },
              "lineHeight": {
                "value": "{typography.lead.normal}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              },
              "iconSize": {
                "value": "{typography.fontSize.base}"
              }
            }
          },
          "strong": {
            "id": "#tokensConfig/prose/strong",
            "properties": {
              "fontWeight": {
                "id": "#tokensConfig/prose/strong/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/strong/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              }
            },
            "type": "object",
            "default": {
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              }
            }
          },
          "img": {
            "id": "#tokensConfig/prose/img",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/img/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/img/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              }
            }
          },
          "a": {
            "id": "#tokensConfig/prose/a",
            "properties": {
              "textDecoration": {
                "id": "#tokensConfig/prose/a/textDecoration",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/a/textDecoration/value",
                    "default": "none"
                  }
                },
                "type": "object",
                "default": {
                  "value": "none"
                }
              },
              "color": {
                "id": "#tokensConfig/prose/a/color",
                "properties": {
                  "static": {
                    "id": "#tokensConfig/prose/a/color/static",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/a/color/static/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/color/static/value/initial",
                            "default": "inherit"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/color/static/value/dark",
                            "default": "inherit"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "inherit",
                          "dark": "inherit"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "inherit",
                        "dark": "inherit"
                      }
                    }
                  },
                  "hover": {
                    "id": "#tokensConfig/prose/a/color/hover",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/a/color/hover/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/color/hover/value/initial",
                            "default": "{typography.color.primary.500}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/color/hover/value/dark",
                            "default": "{typography.color.primary.400}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.primary.500}",
                          "dark": "{typography.color.primary.400}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.primary.500}",
                        "dark": "{typography.color.primary.400}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "static": {
                    "value": {
                      "initial": "inherit",
                      "dark": "inherit"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "{typography.color.primary.500}",
                      "dark": "{typography.color.primary.400}"
                    }
                  }
                }
              },
              "border": {
                "id": "#tokensConfig/prose/a/border",
                "properties": {
                  "width": {
                    "id": "#tokensConfig/prose/a/border/width",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/a/border/width/value",
                        "default": "1px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "1px"
                    }
                  },
                  "style": {
                    "id": "#tokensConfig/prose/a/border/style",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/prose/a/border/style/static",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/border/style/static/value",
                            "default": "dashed"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "dashed"
                        }
                      },
                      "hover": {
                        "id": "#tokensConfig/prose/a/border/style/hover",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/border/style/hover/value",
                            "default": "solid"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "solid"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {
                        "value": "dashed"
                      },
                      "hover": {
                        "value": "solid"
                      }
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/a/border/color",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/prose/a/border/color/static",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/a/border/color/static/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/border/color/static/value/initial",
                                "default": "currentColor"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/border/color/static/value/dark",
                                "default": "currentColor"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "currentColor",
                              "dark": "currentColor"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "currentColor",
                            "dark": "currentColor"
                          }
                        }
                      },
                      "hover": {
                        "id": "#tokensConfig/prose/a/border/color/hover",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/a/border/color/hover/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/border/color/hover/value/initial",
                                "default": "currentColor"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/border/color/hover/value/dark",
                                "default": "currentColor"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "currentColor",
                              "dark": "currentColor"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "currentColor",
                            "dark": "currentColor"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {
                        "value": {
                          "initial": "currentColor",
                          "dark": "currentColor"
                        }
                      },
                      "hover": {
                        "value": {
                          "initial": "currentColor",
                          "dark": "currentColor"
                        }
                      }
                    }
                  },
                  "distance": {
                    "id": "#tokensConfig/prose/a/border/distance",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/a/border/distance/value",
                        "default": "2px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "2px"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "width": {
                    "value": "1px"
                  },
                  "style": {
                    "static": {
                      "value": "dashed"
                    },
                    "hover": {
                      "value": "solid"
                    }
                  },
                  "color": {
                    "static": {
                      "value": {
                        "initial": "currentColor",
                        "dark": "currentColor"
                      }
                    },
                    "hover": {
                      "value": {
                        "initial": "currentColor",
                        "dark": "currentColor"
                      }
                    }
                  },
                  "distance": {
                    "value": "2px"
                  }
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/a/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/a/fontWeight/value",
                    "default": "{typography.fontWeight.medium}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.medium}"
                }
              },
              "hasCode": {
                "id": "#tokensConfig/prose/a/hasCode",
                "properties": {
                  "borderBottom": {
                    "id": "#tokensConfig/prose/a/hasCode/borderBottom",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/a/hasCode/borderBottom/value",
                        "default": "none"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "none"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "borderBottom": {
                    "value": "none"
                  }
                }
              },
              "code": {
                "id": "#tokensConfig/prose/a/code",
                "properties": {
                  "border": {
                    "id": "#tokensConfig/prose/a/code/border",
                    "properties": {
                      "width": {
                        "id": "#tokensConfig/prose/a/code/border/width",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/code/border/width/value",
                            "default": "{prose.a.border.width}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "{prose.a.border.width}"
                        }
                      },
                      "style": {
                        "id": "#tokensConfig/prose/a/code/border/style",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/a/code/border/style/value",
                            "default": "{prose.a.border.style.static}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "{prose.a.border.style.static}"
                        }
                      },
                      "color": {
                        "id": "#tokensConfig/prose/a/code/border/color",
                        "properties": {
                          "static": {
                            "id": "#tokensConfig/prose/a/code/border/color/static",
                            "properties": {
                              "value": {
                                "id": "#tokensConfig/prose/a/code/border/color/static/value",
                                "properties": {
                                  "initial": {
                                    "type": "string",
                                    "id": "#tokensConfig/prose/a/code/border/color/static/value/initial",
                                    "default": "{typography.color.secondary.400}"
                                  },
                                  "dark": {
                                    "type": "string",
                                    "id": "#tokensConfig/prose/a/code/border/color/static/value/dark",
                                    "default": "{typography.color.secondary.600}"
                                  }
                                },
                                "type": "object",
                                "default": {
                                  "initial": "{typography.color.secondary.400}",
                                  "dark": "{typography.color.secondary.600}"
                                }
                              }
                            },
                            "type": "object",
                            "default": {
                              "value": {
                                "initial": "{typography.color.secondary.400}",
                                "dark": "{typography.color.secondary.600}"
                              }
                            }
                          },
                          "hover": {
                            "id": "#tokensConfig/prose/a/code/border/color/hover",
                            "properties": {
                              "value": {
                                "id": "#tokensConfig/prose/a/code/border/color/hover/value",
                                "properties": {
                                  "initial": {
                                    "type": "string",
                                    "id": "#tokensConfig/prose/a/code/border/color/hover/value/initial",
                                    "default": "{typography.color.primary.500}"
                                  },
                                  "dark": {
                                    "type": "string",
                                    "id": "#tokensConfig/prose/a/code/border/color/hover/value/dark",
                                    "default": "{typography.color.primary.600}"
                                  }
                                },
                                "type": "object",
                                "default": {
                                  "initial": "{typography.color.primary.500}",
                                  "dark": "{typography.color.primary.600}"
                                }
                              }
                            },
                            "type": "object",
                            "default": {
                              "value": {
                                "initial": "{typography.color.primary.500}",
                                "dark": "{typography.color.primary.600}"
                              }
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "static": {
                            "value": {
                              "initial": "{typography.color.secondary.400}",
                              "dark": "{typography.color.secondary.600}"
                            }
                          },
                          "hover": {
                            "value": {
                              "initial": "{typography.color.primary.500}",
                              "dark": "{typography.color.primary.600}"
                            }
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "width": {
                        "value": "{prose.a.border.width}"
                      },
                      "style": {
                        "value": "{prose.a.border.style.static}"
                      },
                      "color": {
                        "static": {
                          "value": {
                            "initial": "{typography.color.secondary.400}",
                            "dark": "{typography.color.secondary.600}"
                          }
                        },
                        "hover": {
                          "value": {
                            "initial": "{typography.color.primary.500}",
                            "dark": "{typography.color.primary.600}"
                          }
                        }
                      }
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/a/code/color",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/prose/a/code/color/static",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/a/code/color/static/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/code/color/static/value/initial",
                                "default": "currentColor"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/code/color/static/value/dark",
                                "default": "currentColor"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "currentColor",
                              "dark": "currentColor"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "currentColor",
                            "dark": "currentColor"
                          }
                        }
                      },
                      "hover": {
                        "id": "#tokensConfig/prose/a/code/color/hover",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/a/code/color/hover/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/code/color/hover/value/initial",
                                "default": "currentColor"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/code/color/hover/value/dark",
                                "default": "currentColor"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "currentColor",
                              "dark": "currentColor"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "currentColor",
                            "dark": "currentColor"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {
                        "value": {
                          "initial": "currentColor",
                          "dark": "currentColor"
                        }
                      },
                      "hover": {
                        "value": {
                          "initial": "currentColor",
                          "dark": "currentColor"
                        }
                      }
                    }
                  },
                  "background": {
                    "id": "#tokensConfig/prose/a/code/background",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/prose/a/code/background/static",
                        "type": "any",
                        "default": {}
                      },
                      "hover": {
                        "id": "#tokensConfig/prose/a/code/background/hover",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/a/code/background/hover/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/code/background/hover/value/initial",
                                "default": "{typography.color.primary.50}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/a/code/background/hover/value/dark",
                                "default": "{typography.color.primary.900}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{typography.color.primary.50}",
                              "dark": "{typography.color.primary.900}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{typography.color.primary.50}",
                            "dark": "{typography.color.primary.900}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {},
                      "hover": {
                        "value": {
                          "initial": "{typography.color.primary.50}",
                          "dark": "{typography.color.primary.900}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "border": {
                    "width": {
                      "value": "{prose.a.border.width}"
                    },
                    "style": {
                      "value": "{prose.a.border.style.static}"
                    },
                    "color": {
                      "static": {
                        "value": {
                          "initial": "{typography.color.secondary.400}",
                          "dark": "{typography.color.secondary.600}"
                        }
                      },
                      "hover": {
                        "value": {
                          "initial": "{typography.color.primary.500}",
                          "dark": "{typography.color.primary.600}"
                        }
                      }
                    }
                  },
                  "color": {
                    "static": {
                      "value": {
                        "initial": "currentColor",
                        "dark": "currentColor"
                      }
                    },
                    "hover": {
                      "value": {
                        "initial": "currentColor",
                        "dark": "currentColor"
                      }
                    }
                  },
                  "background": {
                    "static": {},
                    "hover": {
                      "value": {
                        "initial": "{typography.color.primary.50}",
                        "dark": "{typography.color.primary.900}"
                      }
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "textDecoration": {
                "value": "none"
              },
              "color": {
                "static": {
                  "value": {
                    "initial": "inherit",
                    "dark": "inherit"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "{typography.color.primary.500}",
                    "dark": "{typography.color.primary.400}"
                  }
                }
              },
              "border": {
                "width": {
                  "value": "1px"
                },
                "style": {
                  "static": {
                    "value": "dashed"
                  },
                  "hover": {
                    "value": "solid"
                  }
                },
                "color": {
                  "static": {
                    "value": {
                      "initial": "currentColor",
                      "dark": "currentColor"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "currentColor",
                      "dark": "currentColor"
                    }
                  }
                },
                "distance": {
                  "value": "2px"
                }
              },
              "fontWeight": {
                "value": "{typography.fontWeight.medium}"
              },
              "hasCode": {
                "borderBottom": {
                  "value": "none"
                }
              },
              "code": {
                "border": {
                  "width": {
                    "value": "{prose.a.border.width}"
                  },
                  "style": {
                    "value": "{prose.a.border.style.static}"
                  },
                  "color": {
                    "static": {
                      "value": {
                        "initial": "{typography.color.secondary.400}",
                        "dark": "{typography.color.secondary.600}"
                      }
                    },
                    "hover": {
                      "value": {
                        "initial": "{typography.color.primary.500}",
                        "dark": "{typography.color.primary.600}"
                      }
                    }
                  }
                },
                "color": {
                  "static": {
                    "value": {
                      "initial": "currentColor",
                      "dark": "currentColor"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "currentColor",
                      "dark": "currentColor"
                    }
                  }
                },
                "background": {
                  "static": {},
                  "hover": {
                    "value": {
                      "initial": "{typography.color.primary.50}",
                      "dark": "{typography.color.primary.900}"
                    }
                  }
                }
              }
            }
          },
          "blockquote": {
            "id": "#tokensConfig/prose/blockquote",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/blockquote/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/blockquote/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              },
              "paddingInlineStart": {
                "id": "#tokensConfig/prose/blockquote/paddingInlineStart",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/blockquote/paddingInlineStart/value",
                    "default": "24px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "24px"
                }
              },
              "quotes": {
                "id": "#tokensConfig/prose/blockquote/quotes",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/blockquote/quotes/value",
                    "default": "'201C' '201D' '2018' '2019'"
                  }
                },
                "type": "object",
                "default": {
                  "value": "'201C' '201D' '2018' '2019'"
                }
              },
              "color": {
                "id": "#tokensConfig/prose/blockquote/color",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/prose/blockquote/color/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/prose/blockquote/color/value/initial",
                        "default": "{typography.color.secondary.500}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/prose/blockquote/color/value/dark",
                        "default": "{typography.color.secondary.400}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{typography.color.secondary.500}",
                      "dark": "{typography.color.secondary.400}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{typography.color.secondary.500}",
                    "dark": "{typography.color.secondary.400}"
                  }
                }
              },
              "border": {
                "id": "#tokensConfig/prose/blockquote/border",
                "properties": {
                  "width": {
                    "id": "#tokensConfig/prose/blockquote/border/width",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/blockquote/border/width/value",
                        "default": "4px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "4px"
                    }
                  },
                  "style": {
                    "id": "#tokensConfig/prose/blockquote/border/style",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/blockquote/border/style/value",
                        "default": "solid"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "solid"
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/blockquote/border/color",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/blockquote/border/color/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/blockquote/border/color/value/initial",
                            "default": "{typography.color.secondary.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/blockquote/border/color/value/dark",
                            "default": "{typography.color.secondary.700}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.200}",
                          "dark": "{typography.color.secondary.700}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.200}",
                        "dark": "{typography.color.secondary.700}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "width": {
                    "value": "4px"
                  },
                  "style": {
                    "value": "solid"
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.200}",
                      "dark": "{typography.color.secondary.700}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "paddingInlineStart": {
                "value": "24px"
              },
              "quotes": {
                "value": "'201C' '201D' '2018' '2019'"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.500}",
                  "dark": "{typography.color.secondary.400}"
                }
              },
              "border": {
                "width": {
                  "value": "4px"
                },
                "style": {
                  "value": "solid"
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.200}",
                    "dark": "{typography.color.secondary.700}"
                  }
                }
              }
            }
          },
          "ul": {
            "id": "#tokensConfig/prose/ul",
            "properties": {
              "listStyleType": {
                "id": "#tokensConfig/prose/ul/listStyleType",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/ul/listStyleType/value",
                    "default": "disc"
                  }
                },
                "type": "object",
                "default": {
                  "value": "disc"
                }
              },
              "margin": {
                "id": "#tokensConfig/prose/ul/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/ul/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              },
              "paddingInlineStart": {
                "id": "#tokensConfig/prose/ul/paddingInlineStart",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/ul/paddingInlineStart/value",
                    "default": "21px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "21px"
                }
              },
              "li": {
                "id": "#tokensConfig/prose/ul/li",
                "properties": {
                  "markerColor": {
                    "id": "#tokensConfig/prose/ul/li/markerColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/ul/li/markerColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/ul/li/markerColor/value/initial",
                            "default": "currentColor"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/ul/li/markerColor/value/dark",
                            "default": "currentColor"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "currentColor",
                          "dark": "currentColor"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "currentColor",
                        "dark": "currentColor"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "markerColor": {
                    "value": {
                      "initial": "currentColor",
                      "dark": "currentColor"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "listStyleType": {
                "value": "disc"
              },
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "paddingInlineStart": {
                "value": "21px"
              },
              "li": {
                "markerColor": {
                  "value": {
                    "initial": "currentColor",
                    "dark": "currentColor"
                  }
                }
              }
            }
          },
          "ol": {
            "id": "#tokensConfig/prose/ol",
            "properties": {
              "listStyleType": {
                "id": "#tokensConfig/prose/ol/listStyleType",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/ol/listStyleType/value",
                    "default": "decimal"
                  }
                },
                "type": "object",
                "default": {
                  "value": "decimal"
                }
              },
              "margin": {
                "id": "#tokensConfig/prose/ol/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/ol/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              },
              "paddingInlineStart": {
                "id": "#tokensConfig/prose/ol/paddingInlineStart",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/ol/paddingInlineStart/value",
                    "default": "21px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "21px"
                }
              },
              "li": {
                "id": "#tokensConfig/prose/ol/li",
                "properties": {
                  "markerColor": {
                    "id": "#tokensConfig/prose/ol/li/markerColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/ol/li/markerColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/ol/li/markerColor/value/initial",
                            "default": "currentColor"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/ol/li/markerColor/value/dark",
                            "default": "currentColor"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "currentColor",
                          "dark": "currentColor"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "currentColor",
                        "dark": "currentColor"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "markerColor": {
                    "value": {
                      "initial": "currentColor",
                      "dark": "currentColor"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "listStyleType": {
                "value": "decimal"
              },
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "paddingInlineStart": {
                "value": "21px"
              },
              "li": {
                "markerColor": {
                  "value": {
                    "initial": "currentColor",
                    "dark": "currentColor"
                  }
                }
              }
            }
          },
          "li": {
            "id": "#tokensConfig/prose/li",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/li/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/li/margin/value",
                    "default": "{typography.verticalMargin.sm} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.sm} 0"
                }
              },
              "listStylePosition": {
                "id": "#tokensConfig/prose/li/listStylePosition",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/li/listStylePosition/value",
                    "default": "outside"
                  }
                },
                "type": "object",
                "default": {
                  "value": "outside"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "{typography.verticalMargin.sm} 0"
              },
              "listStylePosition": {
                "value": "outside"
              }
            }
          },
          "hr": {
            "id": "#tokensConfig/prose/hr",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/hr/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/hr/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              },
              "style": {
                "id": "#tokensConfig/prose/hr/style",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/hr/style/value",
                    "default": "solid"
                  }
                },
                "type": "object",
                "default": {
                  "value": "solid"
                }
              },
              "width": {
                "id": "#tokensConfig/prose/hr/width",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/hr/width/value",
                    "default": "1px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "1px"
                }
              },
              "color": {
                "id": "#tokensConfig/prose/hr/color",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/prose/hr/color/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/prose/hr/color/value/initial",
                        "default": "{typography.color.secondary.200}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/prose/hr/color/value/dark",
                        "default": "{typography.color.secondary.800}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{typography.color.secondary.200}",
                      "dark": "{typography.color.secondary.800}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{typography.color.secondary.200}",
                    "dark": "{typography.color.secondary.800}"
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "style": {
                "value": "solid"
              },
              "width": {
                "value": "1px"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.200}",
                  "dark": "{typography.color.secondary.800}"
                }
              }
            }
          },
          "table": {
            "id": "#tokensConfig/prose/table",
            "properties": {
              "margin": {
                "id": "#tokensConfig/prose/table/margin",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/table/margin/value",
                    "default": "{typography.verticalMargin.base} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.verticalMargin.base} 0"
                }
              },
              "textAlign": {
                "id": "#tokensConfig/prose/table/textAlign",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/table/textAlign/value",
                    "default": "start"
                  }
                },
                "type": "object",
                "default": {
                  "value": "start"
                }
              },
              "fontSize": {
                "id": "#tokensConfig/prose/table/fontSize",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/table/fontSize/value",
                    "default": "{typography.fontSize.sm}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontSize.sm}"
                }
              },
              "lineHeight": {
                "id": "#tokensConfig/prose/table/lineHeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/table/lineHeight/value",
                    "default": "{typography.lead.6}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.lead.6}"
                }
              }
            },
            "type": "object",
            "default": {
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "textAlign": {
                "value": "start"
              },
              "fontSize": {
                "value": "{typography.fontSize.sm}"
              },
              "lineHeight": {
                "value": "{typography.lead.6}"
              }
            }
          },
          "thead": {
            "id": "#tokensConfig/prose/thead",
            "properties": {
              "border": {
                "id": "#tokensConfig/prose/thead/border",
                "properties": {
                  "width": {
                    "id": "#tokensConfig/prose/thead/border/width",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/thead/border/width/value",
                        "default": "0px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "0px"
                    }
                  },
                  "style": {
                    "id": "#tokensConfig/prose/thead/border/style",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/thead/border/style/value",
                        "default": "solid"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "solid"
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/thead/border/color",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/thead/border/color/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/thead/border/color/value/initial",
                            "default": "{typography.color.secondary.300}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/thead/border/color/value/dark",
                            "default": "{typography.color.secondary.600}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.300}",
                          "dark": "{typography.color.secondary.600}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.300}",
                        "dark": "{typography.color.secondary.600}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "width": {
                    "value": "0px"
                  },
                  "style": {
                    "value": "solid"
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.300}",
                      "dark": "{typography.color.secondary.600}"
                    }
                  }
                }
              },
              "borderBottom": {
                "id": "#tokensConfig/prose/thead/borderBottom",
                "properties": {
                  "width": {
                    "id": "#tokensConfig/prose/thead/borderBottom/width",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/thead/borderBottom/width/value",
                        "default": "1px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "1px"
                    }
                  },
                  "style": {
                    "id": "#tokensConfig/prose/thead/borderBottom/style",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/thead/borderBottom/style/value",
                        "default": "solid"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "solid"
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/thead/borderBottom/color",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/thead/borderBottom/color/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/thead/borderBottom/color/value/initial",
                            "default": "{typography.color.secondary.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/thead/borderBottom/color/value/dark",
                            "default": "{typography.color.secondary.800}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.200}",
                          "dark": "{typography.color.secondary.800}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.200}",
                        "dark": "{typography.color.secondary.800}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "width": {
                    "value": "1px"
                  },
                  "style": {
                    "value": "solid"
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.200}",
                      "dark": "{typography.color.secondary.800}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "border": {
                "width": {
                  "value": "0px"
                },
                "style": {
                  "value": "solid"
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.300}",
                    "dark": "{typography.color.secondary.600}"
                  }
                }
              },
              "borderBottom": {
                "width": {
                  "value": "1px"
                },
                "style": {
                  "value": "solid"
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.200}",
                    "dark": "{typography.color.secondary.800}"
                  }
                }
              }
            }
          },
          "th": {
            "id": "#tokensConfig/prose/th",
            "properties": {
              "color": {
                "id": "#tokensConfig/prose/th/color",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/prose/th/color/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/prose/th/color/value/initial",
                        "default": "{typography.color.secondary.600}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/prose/th/color/value/dark",
                        "default": "{typography.color.secondary.400}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{typography.color.secondary.600}",
                      "dark": "{typography.color.secondary.400}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{typography.color.secondary.600}",
                    "dark": "{typography.color.secondary.400}"
                  }
                }
              },
              "padding": {
                "id": "#tokensConfig/prose/th/padding",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/th/padding/value",
                    "default": "0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}"
                }
              },
              "fontWeight": {
                "id": "#tokensConfig/prose/th/fontWeight",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/th/fontWeight/value",
                    "default": "{typography.fontWeight.semibold}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{typography.fontWeight.semibold}"
                }
              },
              "textAlign": {
                "id": "#tokensConfig/prose/th/textAlign",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/prose/th/textAlign/value",
                    "default": "inherit"
                  }
                },
                "type": "object",
                "default": {
                  "value": "inherit"
                }
              }
            },
            "type": "object",
            "default": {
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.600}",
                  "dark": "{typography.color.secondary.400}"
                }
              },
              "padding": {
                "value": "0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.semibold}"
              },
              "textAlign": {
                "value": "inherit"
              }
            }
          },
          "tbody": {
            "id": "#tokensConfig/prose/tbody",
            "properties": {
              "tr": {
                "id": "#tokensConfig/prose/tbody/tr",
                "properties": {
                  "borderBottom": {
                    "id": "#tokensConfig/prose/tbody/tr/borderBottom",
                    "properties": {
                      "width": {
                        "id": "#tokensConfig/prose/tbody/tr/borderBottom/width",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/tbody/tr/borderBottom/width/value",
                            "default": "1px"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "1px"
                        }
                      },
                      "style": {
                        "id": "#tokensConfig/prose/tbody/tr/borderBottom/style",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/tbody/tr/borderBottom/style/value",
                            "default": "dashed"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "dashed"
                        }
                      },
                      "color": {
                        "id": "#tokensConfig/prose/tbody/tr/borderBottom/color",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/tbody/tr/borderBottom/color/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/tbody/tr/borderBottom/color/value/initial",
                                "default": "{typography.color.secondary.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/tbody/tr/borderBottom/color/value/dark",
                                "default": "{typography.color.secondary.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{typography.color.secondary.200}",
                              "dark": "{typography.color.secondary.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{typography.color.secondary.200}",
                            "dark": "{typography.color.secondary.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "width": {
                        "value": "1px"
                      },
                      "style": {
                        "value": "dashed"
                      },
                      "color": {
                        "value": {
                          "initial": "{typography.color.secondary.200}",
                          "dark": "{typography.color.secondary.800}"
                        }
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "borderBottom": {
                    "width": {
                      "value": "1px"
                    },
                    "style": {
                      "value": "dashed"
                    },
                    "color": {
                      "value": {
                        "initial": "{typography.color.secondary.200}",
                        "dark": "{typography.color.secondary.800}"
                      }
                    }
                  }
                }
              },
              "td": {
                "id": "#tokensConfig/prose/tbody/td",
                "properties": {
                  "padding": {
                    "id": "#tokensConfig/prose/tbody/td/padding",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/tbody/td/padding/value",
                        "default": "{typography.verticalMargin.sm}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{typography.verticalMargin.sm}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "padding": {
                    "value": "{typography.verticalMargin.sm}"
                  }
                }
              },
              "code": {
                "id": "#tokensConfig/prose/tbody/code",
                "properties": {
                  "inline": {
                    "id": "#tokensConfig/prose/tbody/code/inline",
                    "properties": {
                      "fontSize": {
                        "id": "#tokensConfig/prose/tbody/code/inline/fontSize",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/tbody/code/inline/fontSize/value",
                            "default": "{typography.fontSize.sm}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "{typography.fontSize.sm}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "fontSize": {
                        "value": "{typography.fontSize.sm}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "inline": {
                    "fontSize": {
                      "value": "{typography.fontSize.sm}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "tr": {
                "borderBottom": {
                  "width": {
                    "value": "1px"
                  },
                  "style": {
                    "value": "dashed"
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.200}",
                      "dark": "{typography.color.secondary.800}"
                    }
                  }
                }
              },
              "td": {
                "padding": {
                  "value": "{typography.verticalMargin.sm}"
                }
              },
              "code": {
                "inline": {
                  "fontSize": {
                    "value": "{typography.fontSize.sm}"
                  }
                }
              }
            }
          },
          "code": {
            "id": "#tokensConfig/prose/code",
            "properties": {
              "block": {
                "id": "#tokensConfig/prose/code/block",
                "properties": {
                  "fontSize": {
                    "id": "#tokensConfig/prose/code/block/fontSize",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/code/block/fontSize/value",
                        "default": "{typography.fontSize.sm}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{typography.fontSize.sm}"
                    }
                  },
                  "margin": {
                    "id": "#tokensConfig/prose/code/block/margin",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/code/block/margin/value",
                        "default": "{typography.verticalMargin.base} 0"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{typography.verticalMargin.base} 0"
                    }
                  },
                  "border": {
                    "id": "#tokensConfig/prose/code/block/border",
                    "properties": {
                      "width": {
                        "id": "#tokensConfig/prose/code/block/border/width",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/border/width/value",
                            "default": "1px"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "1px"
                        }
                      },
                      "style": {
                        "id": "#tokensConfig/prose/code/block/border/style",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/border/style/value",
                            "default": "solid"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "solid"
                        }
                      },
                      "color": {
                        "id": "#tokensConfig/prose/code/block/border/color",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/prose/code/block/border/color/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/prose/code/block/border/color/value/initial",
                                "default": "{typography.color.secondary.200}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/prose/code/block/border/color/value/dark",
                                "default": "{typography.color.secondary.800}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{typography.color.secondary.200}",
                              "dark": "{typography.color.secondary.800}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{typography.color.secondary.200}",
                            "dark": "{typography.color.secondary.800}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "width": {
                        "value": "1px"
                      },
                      "style": {
                        "value": "solid"
                      },
                      "color": {
                        "value": {
                          "initial": "{typography.color.secondary.200}",
                          "dark": "{typography.color.secondary.800}"
                        }
                      }
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/code/block/color",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/code/block/color/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/color/value/initial",
                            "default": "{typography.color.secondary.700}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/color/value/dark",
                            "default": "{typography.color.secondary.200}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.700}",
                          "dark": "{typography.color.secondary.200}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.700}",
                        "dark": "{typography.color.secondary.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/prose/code/block/backgroundColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/code/block/backgroundColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/backgroundColor/value/initial",
                            "default": "{typography.color.secondary.100}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/backgroundColor/value/dark",
                            "default": "{typography.color.secondary.900}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.100}",
                          "dark": "{typography.color.secondary.900}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.100}",
                        "dark": "{typography.color.secondary.900}"
                      }
                    }
                  },
                  "backdropFilter": {
                    "id": "#tokensConfig/prose/code/block/backdropFilter",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/code/block/backdropFilter/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/backdropFilter/value/initial",
                            "default": "contrast(1)"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/backdropFilter/value/dark",
                            "default": "contrast(1)"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "contrast(1)",
                          "dark": "contrast(1)"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "contrast(1)",
                        "dark": "contrast(1)"
                      }
                    }
                  },
                  "pre": {
                    "id": "#tokensConfig/prose/code/block/pre",
                    "properties": {
                      "padding": {
                        "id": "#tokensConfig/prose/code/block/pre/padding",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/block/pre/padding/value",
                            "default": "{typography.verticalMargin.sm}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "{typography.verticalMargin.sm}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "padding": {
                        "value": "{typography.verticalMargin.sm}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "fontSize": {
                    "value": "{typography.fontSize.sm}"
                  },
                  "margin": {
                    "value": "{typography.verticalMargin.base} 0"
                  },
                  "border": {
                    "width": {
                      "value": "1px"
                    },
                    "style": {
                      "value": "solid"
                    },
                    "color": {
                      "value": {
                        "initial": "{typography.color.secondary.200}",
                        "dark": "{typography.color.secondary.800}"
                      }
                    }
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.700}",
                      "dark": "{typography.color.secondary.200}"
                    }
                  },
                  "backgroundColor": {
                    "value": {
                      "initial": "{typography.color.secondary.100}",
                      "dark": "{typography.color.secondary.900}"
                    }
                  },
                  "backdropFilter": {
                    "value": {
                      "initial": "contrast(1)",
                      "dark": "contrast(1)"
                    }
                  },
                  "pre": {
                    "padding": {
                      "value": "{typography.verticalMargin.sm}"
                    }
                  }
                }
              },
              "inline": {
                "id": "#tokensConfig/prose/code/inline",
                "properties": {
                  "borderRadius": {
                    "id": "#tokensConfig/prose/code/inline/borderRadius",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/code/inline/borderRadius/value",
                        "default": "{radii.xs}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{radii.xs}"
                    }
                  },
                  "padding": {
                    "id": "#tokensConfig/prose/code/inline/padding",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/code/inline/padding/value",
                        "default": "0.2rem 0.375rem 0.2rem 0.375rem"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "0.2rem 0.375rem 0.2rem 0.375rem"
                    }
                  },
                  "fontSize": {
                    "id": "#tokensConfig/prose/code/inline/fontSize",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/code/inline/fontSize/value",
                        "default": "{typography.fontSize.sm}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{typography.fontSize.sm}"
                    }
                  },
                  "fontWeight": {
                    "id": "#tokensConfig/prose/code/inline/fontWeight",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/prose/code/inline/fontWeight/value",
                        "default": "{typography.fontWeight.normal}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{typography.fontWeight.normal}"
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/prose/code/inline/color",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/code/inline/color/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/inline/color/value/initial",
                            "default": "{typography.color.secondary.700}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/inline/color/value/dark",
                            "default": "{typography.color.secondary.200}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.700}",
                          "dark": "{typography.color.secondary.200}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.700}",
                        "dark": "{typography.color.secondary.200}"
                      }
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/prose/code/inline/backgroundColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/prose/code/inline/backgroundColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/inline/backgroundColor/value/initial",
                            "default": "{typography.color.secondary.100}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/prose/code/inline/backgroundColor/value/dark",
                            "default": "{typography.color.secondary.800}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{typography.color.secondary.100}",
                          "dark": "{typography.color.secondary.800}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{typography.color.secondary.100}",
                        "dark": "{typography.color.secondary.800}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "borderRadius": {
                    "value": "{radii.xs}"
                  },
                  "padding": {
                    "value": "0.2rem 0.375rem 0.2rem 0.375rem"
                  },
                  "fontSize": {
                    "value": "{typography.fontSize.sm}"
                  },
                  "fontWeight": {
                    "value": "{typography.fontWeight.normal}"
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.700}",
                      "dark": "{typography.color.secondary.200}"
                    }
                  },
                  "backgroundColor": {
                    "value": {
                      "initial": "{typography.color.secondary.100}",
                      "dark": "{typography.color.secondary.800}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "block": {
                "fontSize": {
                  "value": "{typography.fontSize.sm}"
                },
                "margin": {
                  "value": "{typography.verticalMargin.base} 0"
                },
                "border": {
                  "width": {
                    "value": "1px"
                  },
                  "style": {
                    "value": "solid"
                  },
                  "color": {
                    "value": {
                      "initial": "{typography.color.secondary.200}",
                      "dark": "{typography.color.secondary.800}"
                    }
                  }
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.700}",
                    "dark": "{typography.color.secondary.200}"
                  }
                },
                "backgroundColor": {
                  "value": {
                    "initial": "{typography.color.secondary.100}",
                    "dark": "{typography.color.secondary.900}"
                  }
                },
                "backdropFilter": {
                  "value": {
                    "initial": "contrast(1)",
                    "dark": "contrast(1)"
                  }
                },
                "pre": {
                  "padding": {
                    "value": "{typography.verticalMargin.sm}"
                  }
                }
              },
              "inline": {
                "borderRadius": {
                  "value": "{radii.xs}"
                },
                "padding": {
                  "value": "0.2rem 0.375rem 0.2rem 0.375rem"
                },
                "fontSize": {
                  "value": "{typography.fontSize.sm}"
                },
                "fontWeight": {
                  "value": "{typography.fontWeight.normal}"
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.700}",
                    "dark": "{typography.color.secondary.200}"
                  }
                },
                "backgroundColor": {
                  "value": {
                    "initial": "{typography.color.secondary.100}",
                    "dark": "{typography.color.secondary.800}"
                  }
                }
              }
            }
          }
        },
        "type": "object",
        "default": {
          "p": {
            "fontSize": {
              "value": "{typography.fontSize.base}"
            },
            "lineHeight": {
              "value": "{typography.lead.normal}"
            },
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "br": {
              "margin": {
                "value": "{typography.verticalMargin.base} 0 0 0"
              }
            }
          },
          "h1": {
            "margin": {
              "value": "0 0 2rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.5xl}"
            },
            "lineHeight": {
              "value": "{typography.lead.tight}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.bold}"
            },
            "letterSpacing": {
              "value": "{typography.letterSpacing.tight}"
            },
            "iconSize": {
              "value": "{typography.fontSize.3xl}"
            }
          },
          "h2": {
            "margin": {
              "value": "3rem 0 2rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.4xl}"
            },
            "lineHeight": {
              "value": "{typography.lead.tight}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            },
            "letterSpacing": {
              "value": "{typography.letterSpacing.tight}"
            },
            "iconSize": {
              "value": "{typography.fontSize.2xl}"
            }
          },
          "h3": {
            "margin": {
              "value": "3rem 0 2rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.3xl}"
            },
            "lineHeight": {
              "value": "{typography.lead.snug}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            },
            "letterSpacing": {
              "value": "{typography.letterSpacing.tight}"
            },
            "iconSize": {
              "value": "{typography.fontSize.xl}"
            }
          },
          "h4": {
            "margin": {
              "value": "3rem 0 2rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.2xl}"
            },
            "lineHeight": {
              "value": "{typography.lead.snug}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            },
            "letterSpacing": {
              "value": "{typography.letterSpacing.tight}"
            },
            "iconSize": {
              "value": "{typography.fontSize.lg}"
            }
          },
          "h5": {
            "margin": {
              "value": "3rem 0 2rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.xl}"
            },
            "lineHeight": {
              "value": "{typography.lead.snug}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            },
            "iconSize": {
              "value": "{typography.fontSize.lg}"
            }
          },
          "h6": {
            "margin": {
              "value": "3rem 0 2rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.lg}"
            },
            "lineHeight": {
              "value": "{typography.lead.normal}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            },
            "iconSize": {
              "value": "{typography.fontSize.base}"
            }
          },
          "strong": {
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            }
          },
          "img": {
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            }
          },
          "a": {
            "textDecoration": {
              "value": "none"
            },
            "color": {
              "static": {
                "value": {
                  "initial": "inherit",
                  "dark": "inherit"
                }
              },
              "hover": {
                "value": {
                  "initial": "{typography.color.primary.500}",
                  "dark": "{typography.color.primary.400}"
                }
              }
            },
            "border": {
              "width": {
                "value": "1px"
              },
              "style": {
                "static": {
                  "value": "dashed"
                },
                "hover": {
                  "value": "solid"
                }
              },
              "color": {
                "static": {
                  "value": {
                    "initial": "currentColor",
                    "dark": "currentColor"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "currentColor",
                    "dark": "currentColor"
                  }
                }
              },
              "distance": {
                "value": "2px"
              }
            },
            "fontWeight": {
              "value": "{typography.fontWeight.medium}"
            },
            "hasCode": {
              "borderBottom": {
                "value": "none"
              }
            },
            "code": {
              "border": {
                "width": {
                  "value": "{prose.a.border.width}"
                },
                "style": {
                  "value": "{prose.a.border.style.static}"
                },
                "color": {
                  "static": {
                    "value": {
                      "initial": "{typography.color.secondary.400}",
                      "dark": "{typography.color.secondary.600}"
                    }
                  },
                  "hover": {
                    "value": {
                      "initial": "{typography.color.primary.500}",
                      "dark": "{typography.color.primary.600}"
                    }
                  }
                }
              },
              "color": {
                "static": {
                  "value": {
                    "initial": "currentColor",
                    "dark": "currentColor"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "currentColor",
                    "dark": "currentColor"
                  }
                }
              },
              "background": {
                "static": {},
                "hover": {
                  "value": {
                    "initial": "{typography.color.primary.50}",
                    "dark": "{typography.color.primary.900}"
                  }
                }
              }
            }
          },
          "blockquote": {
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "paddingInlineStart": {
              "value": "24px"
            },
            "quotes": {
              "value": "'201C' '201D' '2018' '2019'"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.500}",
                "dark": "{typography.color.secondary.400}"
              }
            },
            "border": {
              "width": {
                "value": "4px"
              },
              "style": {
                "value": "solid"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.200}",
                  "dark": "{typography.color.secondary.700}"
                }
              }
            }
          },
          "ul": {
            "listStyleType": {
              "value": "disc"
            },
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "paddingInlineStart": {
              "value": "21px"
            },
            "li": {
              "markerColor": {
                "value": {
                  "initial": "currentColor",
                  "dark": "currentColor"
                }
              }
            }
          },
          "ol": {
            "listStyleType": {
              "value": "decimal"
            },
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "paddingInlineStart": {
              "value": "21px"
            },
            "li": {
              "markerColor": {
                "value": {
                  "initial": "currentColor",
                  "dark": "currentColor"
                }
              }
            }
          },
          "li": {
            "margin": {
              "value": "{typography.verticalMargin.sm} 0"
            },
            "listStylePosition": {
              "value": "outside"
            }
          },
          "hr": {
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "style": {
              "value": "solid"
            },
            "width": {
              "value": "1px"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.200}",
                "dark": "{typography.color.secondary.800}"
              }
            }
          },
          "table": {
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "textAlign": {
              "value": "start"
            },
            "fontSize": {
              "value": "{typography.fontSize.sm}"
            },
            "lineHeight": {
              "value": "{typography.lead.6}"
            }
          },
          "thead": {
            "border": {
              "width": {
                "value": "0px"
              },
              "style": {
                "value": "solid"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.300}",
                  "dark": "{typography.color.secondary.600}"
                }
              }
            },
            "borderBottom": {
              "width": {
                "value": "1px"
              },
              "style": {
                "value": "solid"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.200}",
                  "dark": "{typography.color.secondary.800}"
                }
              }
            }
          },
          "th": {
            "color": {
              "value": {
                "initial": "{typography.color.secondary.600}",
                "dark": "{typography.color.secondary.400}"
              }
            },
            "padding": {
              "value": "0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.semibold}"
            },
            "textAlign": {
              "value": "inherit"
            }
          },
          "tbody": {
            "tr": {
              "borderBottom": {
                "width": {
                  "value": "1px"
                },
                "style": {
                  "value": "dashed"
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.200}",
                    "dark": "{typography.color.secondary.800}"
                  }
                }
              }
            },
            "td": {
              "padding": {
                "value": "{typography.verticalMargin.sm}"
              }
            },
            "code": {
              "inline": {
                "fontSize": {
                  "value": "{typography.fontSize.sm}"
                }
              }
            }
          },
          "code": {
            "block": {
              "fontSize": {
                "value": "{typography.fontSize.sm}"
              },
              "margin": {
                "value": "{typography.verticalMargin.base} 0"
              },
              "border": {
                "width": {
                  "value": "1px"
                },
                "style": {
                  "value": "solid"
                },
                "color": {
                  "value": {
                    "initial": "{typography.color.secondary.200}",
                    "dark": "{typography.color.secondary.800}"
                  }
                }
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.700}",
                  "dark": "{typography.color.secondary.200}"
                }
              },
              "backgroundColor": {
                "value": {
                  "initial": "{typography.color.secondary.100}",
                  "dark": "{typography.color.secondary.900}"
                }
              },
              "backdropFilter": {
                "value": {
                  "initial": "contrast(1)",
                  "dark": "contrast(1)"
                }
              },
              "pre": {
                "padding": {
                  "value": "{typography.verticalMargin.sm}"
                }
              }
            },
            "inline": {
              "borderRadius": {
                "value": "{radii.xs}"
              },
              "padding": {
                "value": "0.2rem 0.375rem 0.2rem 0.375rem"
              },
              "fontSize": {
                "value": "{typography.fontSize.sm}"
              },
              "fontWeight": {
                "value": "{typography.fontWeight.normal}"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.700}",
                  "dark": "{typography.color.secondary.200}"
                }
              },
              "backgroundColor": {
                "value": {
                  "initial": "{typography.color.secondary.100}",
                  "dark": "{typography.color.secondary.800}"
                }
              }
            }
          }
        }
      },
      "docus": {
        "title": "All the configurable tokens from Docus.",
        "tags": [
          "@studioIcon material-symbols:docs"
        ],
        "id": "#tokensConfig/docus",
        "properties": {
          "body": {
            "id": "#tokensConfig/docus/body",
            "properties": {
              "backgroundColor": {
                "id": "#tokensConfig/docus/body/backgroundColor",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/docus/body/backgroundColor/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/docus/body/backgroundColor/value/initial",
                        "default": "{color.white}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/docus/body/backgroundColor/value/dark",
                        "default": "{color.black}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{color.white}",
                      "dark": "{color.black}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{color.white}",
                    "dark": "{color.black}"
                  }
                }
              },
              "color": {
                "id": "#tokensConfig/docus/body/color",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/docus/body/color/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/docus/body/color/value/initial",
                        "default": "{color.gray.800}"
                      },
                      "dark": {
                        "type": "string",
                        "id": "#tokensConfig/docus/body/color/value/dark",
                        "default": "{color.gray.200}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "{color.gray.800}",
                      "dark": "{color.gray.200}"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "{color.gray.800}",
                    "dark": "{color.gray.200}"
                  }
                }
              },
              "fontFamily": {
                "id": "#tokensConfig/docus/body/fontFamily",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/body/fontFamily/value",
                    "default": "{font.sans}"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{font.sans}"
                }
              }
            },
            "type": "object",
            "default": {
              "backgroundColor": {
                "value": {
                  "initial": "{color.white}",
                  "dark": "{color.black}"
                }
              },
              "color": {
                "value": {
                  "initial": "{color.gray.800}",
                  "dark": "{color.gray.200}"
                }
              },
              "fontFamily": {
                "value": "{font.sans}"
              }
            }
          },
          "header": {
            "id": "#tokensConfig/docus/header",
            "properties": {
              "height": {
                "id": "#tokensConfig/docus/header/height",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/header/height/value",
                    "default": "64px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "64px"
                }
              },
              "logo": {
                "id": "#tokensConfig/docus/header/logo",
                "properties": {
                  "height": {
                    "id": "#tokensConfig/docus/header/logo/height",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/docus/header/logo/height/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/docus/header/logo/height/value/initial",
                            "default": "{space.6}"
                          },
                          "sm": {
                            "type": "string",
                            "id": "#tokensConfig/docus/header/logo/height/value/sm",
                            "default": "{space.7}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{space.6}",
                          "sm": "{space.7}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{space.6}",
                        "sm": "{space.7}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "height": {
                    "value": {
                      "initial": "{space.6}",
                      "sm": "{space.7}"
                    }
                  }
                }
              },
              "title": {
                "id": "#tokensConfig/docus/header/title",
                "properties": {
                  "fontSize": {
                    "id": "#tokensConfig/docus/header/title/fontSize",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/header/title/fontSize/value",
                        "default": "{fontSize.2xl}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{fontSize.2xl}"
                    }
                  },
                  "fontWeight": {
                    "id": "#tokensConfig/docus/header/title/fontWeight",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/header/title/fontWeight/value",
                        "default": "{fontWeight.bold}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{fontWeight.bold}"
                    }
                  },
                  "color": {
                    "id": "#tokensConfig/docus/header/title/color",
                    "properties": {
                      "static": {
                        "id": "#tokensConfig/docus/header/title/color/static",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/docus/header/title/color/static/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/docus/header/title/color/static/value/initial",
                                "default": "{color.gray.900}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/docus/header/title/color/static/value/dark",
                                "default": "{color.gray.100}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.gray.900}",
                              "dark": "{color.gray.100}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.gray.900}",
                            "dark": "{color.gray.100}"
                          }
                        }
                      },
                      "hover": {
                        "id": "#tokensConfig/docus/header/title/color/hover",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/docus/header/title/color/hover/value",
                            "default": "{color.primary.500}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "{color.primary.500}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "static": {
                        "value": {
                          "initial": "{color.gray.900}",
                          "dark": "{color.gray.100}"
                        }
                      },
                      "hover": {
                        "value": "{color.primary.500}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "fontSize": {
                    "value": "{fontSize.2xl}"
                  },
                  "fontWeight": {
                    "value": "{fontWeight.bold}"
                  },
                  "color": {
                    "static": {
                      "value": {
                        "initial": "{color.gray.900}",
                        "dark": "{color.gray.100}"
                      }
                    },
                    "hover": {
                      "value": "{color.primary.500}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "height": {
                "value": "64px"
              },
              "logo": {
                "height": {
                  "value": {
                    "initial": "{space.6}",
                    "sm": "{space.7}"
                  }
                }
              },
              "title": {
                "fontSize": {
                  "value": "{fontSize.2xl}"
                },
                "fontWeight": {
                  "value": "{fontWeight.bold}"
                },
                "color": {
                  "static": {
                    "value": {
                      "initial": "{color.gray.900}",
                      "dark": "{color.gray.100}"
                    }
                  },
                  "hover": {
                    "value": "{color.primary.500}"
                  }
                }
              }
            }
          },
          "footer": {
            "id": "#tokensConfig/docus/footer",
            "properties": {
              "height": {
                "id": "#tokensConfig/docus/footer/height",
                "properties": {
                  "value": {
                    "id": "#tokensConfig/docus/footer/height/value",
                    "properties": {
                      "initial": {
                        "type": "string",
                        "id": "#tokensConfig/docus/footer/height/value/initial",
                        "default": "145px"
                      },
                      "sm": {
                        "type": "string",
                        "id": "#tokensConfig/docus/footer/height/value/sm",
                        "default": "100px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "initial": "145px",
                      "sm": "100px"
                    }
                  }
                },
                "type": "object",
                "default": {
                  "value": {
                    "initial": "145px",
                    "sm": "100px"
                  }
                }
              },
              "padding": {
                "id": "#tokensConfig/docus/footer/padding",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/footer/padding/value",
                    "default": "{space.4} 0"
                  }
                },
                "type": "object",
                "default": {
                  "value": "{space.4} 0"
                }
              }
            },
            "type": "object",
            "default": {
              "height": {
                "value": {
                  "initial": "145px",
                  "sm": "100px"
                }
              },
              "padding": {
                "value": "{space.4} 0"
              }
            }
          },
          "readableLine": {
            "id": "#tokensConfig/docus/readableLine",
            "properties": {
              "value": {
                "type": "string",
                "id": "#tokensConfig/docus/readableLine/value",
                "default": "78ch"
              }
            },
            "type": "object",
            "default": {
              "value": "78ch"
            }
          },
          "loadingBar": {
            "id": "#tokensConfig/docus/loadingBar",
            "properties": {
              "height": {
                "id": "#tokensConfig/docus/loadingBar/height",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/loadingBar/height/value",
                    "default": "3px"
                  }
                },
                "type": "object",
                "default": {
                  "value": "3px"
                }
              },
              "gradientColorStop1": {
                "id": "#tokensConfig/docus/loadingBar/gradientColorStop1",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/loadingBar/gradientColorStop1/value",
                    "default": "#00dc82"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#00dc82"
                }
              },
              "gradientColorStop2": {
                "id": "#tokensConfig/docus/loadingBar/gradientColorStop2",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/loadingBar/gradientColorStop2/value",
                    "default": "#34cdfe"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#34cdfe"
                }
              },
              "gradientColorStop3": {
                "id": "#tokensConfig/docus/loadingBar/gradientColorStop3",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/loadingBar/gradientColorStop3/value",
                    "default": "#0047e1"
                  }
                },
                "type": "object",
                "default": {
                  "value": "#0047e1"
                }
              }
            },
            "type": "object",
            "default": {
              "height": {
                "value": "3px"
              },
              "gradientColorStop1": {
                "value": "#00dc82"
              },
              "gradientColorStop2": {
                "value": "#34cdfe"
              },
              "gradientColorStop3": {
                "value": "#0047e1"
              }
            }
          },
          "search": {
            "id": "#tokensConfig/docus/search",
            "properties": {
              "backdropFilter": {
                "id": "#tokensConfig/docus/search/backdropFilter",
                "properties": {
                  "value": {
                    "type": "string",
                    "id": "#tokensConfig/docus/search/backdropFilter/value",
                    "default": "blur(24px)"
                  }
                },
                "type": "object",
                "default": {
                  "value": "blur(24px)"
                }
              },
              "input": {
                "id": "#tokensConfig/docus/search/input",
                "properties": {
                  "borderRadius": {
                    "id": "#tokensConfig/docus/search/input/borderRadius",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/search/input/borderRadius/value",
                        "default": "{radii.2xs}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{radii.2xs}"
                    }
                  },
                  "borderWidth": {
                    "id": "#tokensConfig/docus/search/input/borderWidth",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/search/input/borderWidth/value",
                        "default": "1px"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "1px"
                    }
                  },
                  "borderStyle": {
                    "id": "#tokensConfig/docus/search/input/borderStyle",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/search/input/borderStyle/value",
                        "default": "solid"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "solid"
                    }
                  },
                  "borderColor": {
                    "id": "#tokensConfig/docus/search/input/borderColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/docus/search/input/borderColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/input/borderColor/value/initial",
                            "default": "{color.gray.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/input/borderColor/value/dark",
                            "default": "transparent"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.200}",
                          "dark": "transparent"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.200}",
                        "dark": "transparent"
                      }
                    }
                  },
                  "fontSize": {
                    "id": "#tokensConfig/docus/search/input/fontSize",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/search/input/fontSize/value",
                        "default": "{fontSize.sm}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{fontSize.sm}"
                    }
                  },
                  "gap": {
                    "id": "#tokensConfig/docus/search/input/gap",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/search/input/gap/value",
                        "default": "{space.2}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{space.2}"
                    }
                  },
                  "padding": {
                    "id": "#tokensConfig/docus/search/input/padding",
                    "properties": {
                      "value": {
                        "type": "string",
                        "id": "#tokensConfig/docus/search/input/padding/value",
                        "default": "{space.2} {space.4}"
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": "{space.2} {space.4}"
                    }
                  },
                  "backgroundColor": {
                    "id": "#tokensConfig/docus/search/input/backgroundColor",
                    "properties": {
                      "value": {
                        "id": "#tokensConfig/docus/search/input/backgroundColor/value",
                        "properties": {
                          "initial": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/input/backgroundColor/value/initial",
                            "default": "{color.gray.200}"
                          },
                          "dark": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/input/backgroundColor/value/dark",
                            "default": "{color.gray.800}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "initial": "{color.gray.200}",
                          "dark": "{color.gray.800}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "value": {
                        "initial": "{color.gray.200}",
                        "dark": "{color.gray.800}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "borderRadius": {
                    "value": "{radii.2xs}"
                  },
                  "borderWidth": {
                    "value": "1px"
                  },
                  "borderStyle": {
                    "value": "solid"
                  },
                  "borderColor": {
                    "value": {
                      "initial": "{color.gray.200}",
                      "dark": "transparent"
                    }
                  },
                  "fontSize": {
                    "value": "{fontSize.sm}"
                  },
                  "gap": {
                    "value": "{space.2}"
                  },
                  "padding": {
                    "value": "{space.2} {space.4}"
                  },
                  "backgroundColor": {
                    "value": {
                      "initial": "{color.gray.200}",
                      "dark": "{color.gray.800}"
                    }
                  }
                }
              },
              "results": {
                "id": "#tokensConfig/docus/search/results",
                "properties": {
                  "window": {
                    "id": "#tokensConfig/docus/search/results/window",
                    "properties": {
                      "marginX": {
                        "id": "#tokensConfig/docus/search/results/window/marginX",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/docus/search/results/window/marginX/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/marginX/value/initial",
                                "default": "0"
                              },
                              "sm": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/marginX/value/sm",
                                "default": "{space.4}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "0",
                              "sm": "{space.4}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "0",
                            "sm": "{space.4}"
                          }
                        }
                      },
                      "borderRadius": {
                        "id": "#tokensConfig/docus/search/results/window/borderRadius",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/docus/search/results/window/borderRadius/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/borderRadius/value/initial",
                                "default": "none"
                              },
                              "sm": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/borderRadius/value/sm",
                                "default": "{radii.xs}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "none",
                              "sm": "{radii.xs}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "none",
                            "sm": "{radii.xs}"
                          }
                        }
                      },
                      "marginTop": {
                        "id": "#tokensConfig/docus/search/results/window/marginTop",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/docus/search/results/window/marginTop/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/marginTop/value/initial",
                                "default": "0"
                              },
                              "sm": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/marginTop/value/sm",
                                "default": "20vh"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "0",
                              "sm": "20vh"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "0",
                            "sm": "20vh"
                          }
                        }
                      },
                      "maxWidth": {
                        "id": "#tokensConfig/docus/search/results/window/maxWidth",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/results/window/maxWidth/value",
                            "default": "640px"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "640px"
                        }
                      },
                      "maxHeight": {
                        "id": "#tokensConfig/docus/search/results/window/maxHeight",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/docus/search/results/window/maxHeight/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/maxHeight/value/initial",
                                "default": "100%"
                              },
                              "sm": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/window/maxHeight/value/sm",
                                "default": "320px"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "100%",
                              "sm": "320px"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "100%",
                            "sm": "320px"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "marginX": {
                        "value": {
                          "initial": "0",
                          "sm": "{space.4}"
                        }
                      },
                      "borderRadius": {
                        "value": {
                          "initial": "none",
                          "sm": "{radii.xs}"
                        }
                      },
                      "marginTop": {
                        "value": {
                          "initial": "0",
                          "sm": "20vh"
                        }
                      },
                      "maxWidth": {
                        "value": "640px"
                      },
                      "maxHeight": {
                        "value": {
                          "initial": "100%",
                          "sm": "320px"
                        }
                      }
                    }
                  },
                  "selected": {
                    "id": "#tokensConfig/docus/search/results/selected",
                    "properties": {
                      "backgroundColor": {
                        "id": "#tokensConfig/docus/search/results/selected/backgroundColor",
                        "properties": {
                          "value": {
                            "id": "#tokensConfig/docus/search/results/selected/backgroundColor/value",
                            "properties": {
                              "initial": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/selected/backgroundColor/value/initial",
                                "default": "{color.gray.300}"
                              },
                              "dark": {
                                "type": "string",
                                "id": "#tokensConfig/docus/search/results/selected/backgroundColor/value/dark",
                                "default": "{color.gray.700}"
                              }
                            },
                            "type": "object",
                            "default": {
                              "initial": "{color.gray.300}",
                              "dark": "{color.gray.700}"
                            }
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": {
                            "initial": "{color.gray.300}",
                            "dark": "{color.gray.700}"
                          }
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "backgroundColor": {
                        "value": {
                          "initial": "{color.gray.300}",
                          "dark": "{color.gray.700}"
                        }
                      }
                    }
                  },
                  "highlight": {
                    "id": "#tokensConfig/docus/search/results/highlight",
                    "properties": {
                      "color": {
                        "id": "#tokensConfig/docus/search/results/highlight/color",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/results/highlight/color/value",
                            "default": "white"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "white"
                        }
                      },
                      "backgroundColor": {
                        "id": "#tokensConfig/docus/search/results/highlight/backgroundColor",
                        "properties": {
                          "value": {
                            "type": "string",
                            "id": "#tokensConfig/docus/search/results/highlight/backgroundColor/value",
                            "default": "{color.primary.500}"
                          }
                        },
                        "type": "object",
                        "default": {
                          "value": "{color.primary.500}"
                        }
                      }
                    },
                    "type": "object",
                    "default": {
                      "color": {
                        "value": "white"
                      },
                      "backgroundColor": {
                        "value": "{color.primary.500}"
                      }
                    }
                  }
                },
                "type": "object",
                "default": {
                  "window": {
                    "marginX": {
                      "value": {
                        "initial": "0",
                        "sm": "{space.4}"
                      }
                    },
                    "borderRadius": {
                      "value": {
                        "initial": "none",
                        "sm": "{radii.xs}"
                      }
                    },
                    "marginTop": {
                      "value": {
                        "initial": "0",
                        "sm": "20vh"
                      }
                    },
                    "maxWidth": {
                      "value": "640px"
                    },
                    "maxHeight": {
                      "value": {
                        "initial": "100%",
                        "sm": "320px"
                      }
                    }
                  },
                  "selected": {
                    "backgroundColor": {
                      "value": {
                        "initial": "{color.gray.300}",
                        "dark": "{color.gray.700}"
                      }
                    }
                  },
                  "highlight": {
                    "color": {
                      "value": "white"
                    },
                    "backgroundColor": {
                      "value": "{color.primary.500}"
                    }
                  }
                }
              }
            },
            "type": "object",
            "default": {
              "backdropFilter": {
                "value": "blur(24px)"
              },
              "input": {
                "borderRadius": {
                  "value": "{radii.2xs}"
                },
                "borderWidth": {
                  "value": "1px"
                },
                "borderStyle": {
                  "value": "solid"
                },
                "borderColor": {
                  "value": {
                    "initial": "{color.gray.200}",
                    "dark": "transparent"
                  }
                },
                "fontSize": {
                  "value": "{fontSize.sm}"
                },
                "gap": {
                  "value": "{space.2}"
                },
                "padding": {
                  "value": "{space.2} {space.4}"
                },
                "backgroundColor": {
                  "value": {
                    "initial": "{color.gray.200}",
                    "dark": "{color.gray.800}"
                  }
                }
              },
              "results": {
                "window": {
                  "marginX": {
                    "value": {
                      "initial": "0",
                      "sm": "{space.4}"
                    }
                  },
                  "borderRadius": {
                    "value": {
                      "initial": "none",
                      "sm": "{radii.xs}"
                    }
                  },
                  "marginTop": {
                    "value": {
                      "initial": "0",
                      "sm": "20vh"
                    }
                  },
                  "maxWidth": {
                    "value": "640px"
                  },
                  "maxHeight": {
                    "value": {
                      "initial": "100%",
                      "sm": "320px"
                    }
                  }
                },
                "selected": {
                  "backgroundColor": {
                    "value": {
                      "initial": "{color.gray.300}",
                      "dark": "{color.gray.700}"
                    }
                  }
                },
                "highlight": {
                  "color": {
                    "value": "white"
                  },
                  "backgroundColor": {
                    "value": "{color.primary.500}"
                  }
                }
              }
            }
          }
        },
        "type": "object",
        "default": {
          "body": {
            "backgroundColor": {
              "value": {
                "initial": "{color.white}",
                "dark": "{color.black}"
              }
            },
            "color": {
              "value": {
                "initial": "{color.gray.800}",
                "dark": "{color.gray.200}"
              }
            },
            "fontFamily": {
              "value": "{font.sans}"
            }
          },
          "header": {
            "height": {
              "value": "64px"
            },
            "logo": {
              "height": {
                "value": {
                  "initial": "{space.6}",
                  "sm": "{space.7}"
                }
              }
            },
            "title": {
              "fontSize": {
                "value": "{fontSize.2xl}"
              },
              "fontWeight": {
                "value": "{fontWeight.bold}"
              },
              "color": {
                "static": {
                  "value": {
                    "initial": "{color.gray.900}",
                    "dark": "{color.gray.100}"
                  }
                },
                "hover": {
                  "value": "{color.primary.500}"
                }
              }
            }
          },
          "footer": {
            "height": {
              "value": {
                "initial": "145px",
                "sm": "100px"
              }
            },
            "padding": {
              "value": "{space.4} 0"
            }
          },
          "readableLine": {
            "value": "78ch"
          },
          "loadingBar": {
            "height": {
              "value": "3px"
            },
            "gradientColorStop1": {
              "value": "#00dc82"
            },
            "gradientColorStop2": {
              "value": "#34cdfe"
            },
            "gradientColorStop3": {
              "value": "#0047e1"
            }
          },
          "search": {
            "backdropFilter": {
              "value": "blur(24px)"
            },
            "input": {
              "borderRadius": {
                "value": "{radii.2xs}"
              },
              "borderWidth": {
                "value": "1px"
              },
              "borderStyle": {
                "value": "solid"
              },
              "borderColor": {
                "value": {
                  "initial": "{color.gray.200}",
                  "dark": "transparent"
                }
              },
              "fontSize": {
                "value": "{fontSize.sm}"
              },
              "gap": {
                "value": "{space.2}"
              },
              "padding": {
                "value": "{space.2} {space.4}"
              },
              "backgroundColor": {
                "value": {
                  "initial": "{color.gray.200}",
                  "dark": "{color.gray.800}"
                }
              }
            },
            "results": {
              "window": {
                "marginX": {
                  "value": {
                    "initial": "0",
                    "sm": "{space.4}"
                  }
                },
                "borderRadius": {
                  "value": {
                    "initial": "none",
                    "sm": "{radii.xs}"
                  }
                },
                "marginTop": {
                  "value": {
                    "initial": "0",
                    "sm": "20vh"
                  }
                },
                "maxWidth": {
                  "value": "640px"
                },
                "maxHeight": {
                  "value": {
                    "initial": "100%",
                    "sm": "320px"
                  }
                }
              },
              "selected": {
                "backgroundColor": {
                  "value": {
                    "initial": "{color.gray.300}",
                    "dark": "{color.gray.700}"
                  }
                }
              },
              "highlight": {
                "color": {
                  "value": "white"
                },
                "backgroundColor": {
                  "value": "{color.primary.500}"
                }
              }
            }
          }
        }
      }
    },
    "type": "object",
    "default": {
      "media": {
        "xs": {
          "value": "(min-width: 475px)"
        },
        "sm": {
          "value": "(min-width: 640px)"
        },
        "md": {
          "value": "(min-width: 768px)"
        },
        "lg": {
          "value": "(min-width: 1024px)"
        },
        "xl": {
          "value": "(min-width: 1280px)"
        },
        "2xl": {
          "value": "(min-width: 1536px)"
        },
        "rm": {
          "value": "(prefers-reduced-motion: reduce)"
        },
        "landscape": {
          "value": "only screen and (orientation: landscape)"
        },
        "portrait": {
          "value": "only screen and (orientation: portrait)"
        }
      },
      "color": {
        "white": {
          "value": "#ffffff"
        },
        "black": {
          "value": "#0B0A0A"
        },
        "gray": {
          "50": {
            "value": "#FBFBFB"
          },
          "100": {
            "value": "#F6F5F4"
          },
          "200": {
            "value": "#ECEBE8"
          },
          "300": {
            "value": "#DBD9D3"
          },
          "400": {
            "value": "#ADA9A4"
          },
          "500": {
            "value": "#97948F"
          },
          "600": {
            "value": "#67635D"
          },
          "700": {
            "value": "#36332E"
          },
          "800": {
            "value": "#201E1B"
          },
          "900": {
            "value": "#121110"
          }
        },
        "green": {
          "50": {
            "value": "#ECFFF7"
          },
          "100": {
            "value": "#DEFFF1"
          },
          "200": {
            "value": "#C3FFE6"
          },
          "300": {
            "value": "#86FBCB"
          },
          "400": {
            "value": "#3CEEA5"
          },
          "500": {
            "value": "#0DD885"
          },
          "600": {
            "value": "#00B467"
          },
          "700": {
            "value": "#006037"
          },
          "800": {
            "value": "#002817"
          },
          "900": {
            "value": "#00190F"
          }
        },
        "yellow": {
          "50": {
            "value": "#FFFCEE"
          },
          "100": {
            "value": "#FFF6D3"
          },
          "200": {
            "value": "#FFF0B1"
          },
          "300": {
            "value": "#FFE372"
          },
          "400": {
            "value": "#FFDC4E"
          },
          "500": {
            "value": "#FBCA05"
          },
          "600": {
            "value": "#CBA408"
          },
          "700": {
            "value": "#614E02"
          },
          "800": {
            "value": "#292100"
          },
          "900": {
            "value": "#1B1500"
          }
        },
        "orange": {
          "50": {
            "value": "#ffe9d9"
          },
          "100": {
            "value": "#ffd3b3"
          },
          "200": {
            "value": "#ffbd8d"
          },
          "300": {
            "value": "#ffa666"
          },
          "400": {
            "value": "#ff9040"
          },
          "500": {
            "value": "#ff7a1a"
          },
          "600": {
            "value": "#e15e00"
          },
          "700": {
            "value": "#a94700"
          },
          "800": {
            "value": "#702f00"
          },
          "900": {
            "value": "#381800"
          }
        },
        "red": {
          "50": {
            "value": "#FFF9F8"
          },
          "100": {
            "value": "#FFF3F0"
          },
          "200": {
            "value": "#FFDED7"
          },
          "300": {
            "value": "#FFA692"
          },
          "400": {
            "value": "#FF7353"
          },
          "500": {
            "value": "#FF3B10"
          },
          "600": {
            "value": "#BB2402"
          },
          "700": {
            "value": "#701704"
          },
          "800": {
            "value": "#340A01"
          },
          "900": {
            "value": "#1C0301"
          }
        },
        "pear": {
          "50": {
            "value": "#f7f8dc"
          },
          "100": {
            "value": "#eff0ba"
          },
          "200": {
            "value": "#e8e997"
          },
          "300": {
            "value": "#e0e274"
          },
          "400": {
            "value": "#d8da52"
          },
          "500": {
            "value": "#d0d32f"
          },
          "600": {
            "value": "#a8aa24"
          },
          "700": {
            "value": "#7e801b"
          },
          "800": {
            "value": "#545512"
          },
          "900": {
            "value": "#2a2b09"
          }
        },
        "teal": {
          "50": {
            "value": "#d7faf8"
          },
          "100": {
            "value": "#aff4f0"
          },
          "200": {
            "value": "#87efe9"
          },
          "300": {
            "value": "#5fe9e1"
          },
          "400": {
            "value": "#36e4da"
          },
          "500": {
            "value": "#1cd1c6"
          },
          "600": {
            "value": "#16a79e"
          },
          "700": {
            "value": "#117d77"
          },
          "800": {
            "value": "#0b544f"
          },
          "900": {
            "value": "#062a28"
          }
        },
        "lightblue": {
          "50": {
            "value": "#d9f8ff"
          },
          "100": {
            "value": "#b3f1ff"
          },
          "200": {
            "value": "#8deaff"
          },
          "300": {
            "value": "#66e4ff"
          },
          "400": {
            "value": "#40ddff"
          },
          "500": {
            "value": "#1ad6ff"
          },
          "600": {
            "value": "#00b9e1"
          },
          "700": {
            "value": "#008aa9"
          },
          "800": {
            "value": "#005c70"
          },
          "900": {
            "value": "#002e38"
          }
        },
        "blue": {
          "50": {
            "value": "#F2FAFF"
          },
          "100": {
            "value": "#DFF3FF"
          },
          "200": {
            "value": "#C6EAFF"
          },
          "300": {
            "value": "#A1DDFF"
          },
          "400": {
            "value": "#64C7FF"
          },
          "500": {
            "value": "#1AADFF"
          },
          "600": {
            "value": "#0069A6"
          },
          "700": {
            "value": "#014267"
          },
          "800": {
            "value": "#002235"
          },
          "900": {
            "value": "#00131D"
          }
        },
        "indigoblue": {
          "50": {
            "value": "#d9e5ff"
          },
          "100": {
            "value": "#b3cbff"
          },
          "200": {
            "value": "#8db0ff"
          },
          "300": {
            "value": "#6696ff"
          },
          "400": {
            "value": "#407cff"
          },
          "500": {
            "value": "#1a62ff"
          },
          "600": {
            "value": "#0047e1"
          },
          "700": {
            "value": "#0035a9"
          },
          "800": {
            "value": "#002370"
          },
          "900": {
            "value": "#001238"
          }
        },
        "royalblue": {
          "50": {
            "value": "#dfdbfb"
          },
          "100": {
            "value": "#c0b7f7"
          },
          "200": {
            "value": "#a093f3"
          },
          "300": {
            "value": "#806ff0"
          },
          "400": {
            "value": "#614bec"
          },
          "500": {
            "value": "#4127e8"
          },
          "600": {
            "value": "#2c15c4"
          },
          "700": {
            "value": "#211093"
          },
          "800": {
            "value": "#160a62"
          },
          "900": {
            "value": "#0b0531"
          }
        },
        "purple": {
          "50": {
            "value": "#ead9ff"
          },
          "100": {
            "value": "#d5b3ff"
          },
          "200": {
            "value": "#c08dff"
          },
          "300": {
            "value": "#ab66ff"
          },
          "400": {
            "value": "#9640ff"
          },
          "500": {
            "value": "#811aff"
          },
          "600": {
            "value": "#6500e1"
          },
          "700": {
            "value": "#4c00a9"
          },
          "800": {
            "value": "#330070"
          },
          "900": {
            "value": "#190038"
          }
        },
        "pink": {
          "50": {
            "value": "#ffd9f2"
          },
          "100": {
            "value": "#ffb3e5"
          },
          "200": {
            "value": "#ff8dd8"
          },
          "300": {
            "value": "#ff66cc"
          },
          "400": {
            "value": "#ff40bf"
          },
          "500": {
            "value": "#ff1ab2"
          },
          "600": {
            "value": "#e10095"
          },
          "700": {
            "value": "#a90070"
          },
          "800": {
            "value": "#70004b"
          },
          "900": {
            "value": "#380025"
          }
        },
        "ruby": {
          "50": {
            "value": "#ffd9e4"
          },
          "100": {
            "value": "#ffb3c9"
          },
          "200": {
            "value": "#ff8dae"
          },
          "300": {
            "value": "#ff6694"
          },
          "400": {
            "value": "#ff4079"
          },
          "500": {
            "value": "#ff1a5e"
          },
          "600": {
            "value": "#e10043"
          },
          "700": {
            "value": "#a90032"
          },
          "800": {
            "value": "#700021"
          },
          "900": {
            "value": "#380011"
          }
        },
        "primary": {
          "50": {
            "value": "#F1FCFF"
          },
          "100": {
            "value": "#DCF7FF"
          },
          "200": {
            "value": "#C5F2FF"
          },
          "300": {
            "value": "#82E3FF"
          },
          "400": {
            "value": "#55E1FF"
          },
          "500": {
            "value": "#1AD6FF"
          },
          "600": {
            "value": "#09A0C1"
          },
          "700": {
            "value": "#024757"
          },
          "800": {
            "value": "#00232B"
          },
          "900": {
            "value": "#001A1F"
          }
        },
        "secondary": {
          "50": {
            "value": "{color.gray.50}"
          },
          "100": {
            "value": "{color.gray.100}"
          },
          "200": {
            "value": "{color.gray.200}"
          },
          "300": {
            "value": "{color.gray.300}"
          },
          "400": {
            "value": "{color.gray.400}"
          },
          "500": {
            "value": "{color.gray.500}"
          },
          "600": {
            "value": "{color.gray.600}"
          },
          "700": {
            "value": "{color.gray.700}"
          },
          "800": {
            "value": "{color.gray.800}"
          },
          "900": {
            "value": "{color.gray.900}"
          }
        },
        "shadow": {
          "value": {
            "initial": "{color.gray.400}",
            "dark": "{color.gray.800}"
          }
        }
      },
      "width": {
        "screen": {
          "value": "100vw"
        }
      },
      "height": {
        "screen": {
          "value": "100vh"
        }
      },
      "shadow": {
        "xs": {
          "value": "0px 1px 2px 0px {color.shadow}"
        },
        "sm": {
          "value": "0px 1px 3px 0px {color.shadow}, 0px 1px 2px -1px {color.shadow}"
        },
        "md": {
          "value": "0px 4px 6px -1px {color.shadow}, 0px 2px 4px -2px {color.shadow}"
        },
        "lg": {
          "value": "0px 10px 15px -3px {color.shadow}, 0px 4px 6px -4px {color.shadow}"
        },
        "xl": {
          "value": "0px 20px 25px -5px {color.shadow}, 0px 8px 10px -6px {color.shadow}"
        },
        "2xl": {
          "value": "0px 25px 50px -12px {color.shadow}"
        },
        "none": {
          "value": "0px 0px 0px 0px transparent"
        }
      },
      "radii": {
        "none": {
          "value": "0px"
        },
        "2xs": {
          "value": "0.125rem"
        },
        "xs": {
          "value": "0.25rem"
        },
        "sm": {
          "value": "0.375rem"
        },
        "md": {
          "value": "0.5rem"
        },
        "lg": {
          "value": "0.75rem"
        },
        "xl": {
          "value": "1rem"
        },
        "2xl": {
          "value": "1.5rem"
        },
        "3xl": {
          "value": "1.75rem"
        },
        "full": {
          "value": "9999px"
        }
      },
      "size": {
        "0": {
          "value": "0px"
        },
        "2": {
          "value": "2px"
        },
        "4": {
          "value": "4px"
        },
        "6": {
          "value": "6px"
        },
        "8": {
          "value": "8px"
        },
        "12": {
          "value": "12px"
        },
        "16": {
          "value": "16px"
        },
        "20": {
          "value": "20px"
        },
        "24": {
          "value": "24px"
        },
        "32": {
          "value": "32px"
        },
        "40": {
          "value": "40px"
        },
        "48": {
          "value": "48px"
        },
        "56": {
          "value": "56px"
        },
        "64": {
          "value": "64px"
        },
        "80": {
          "value": "80px"
        },
        "104": {
          "value": "104px"
        },
        "200": {
          "value": "200px"
        },
        "xs": {
          "value": "20rem"
        },
        "sm": {
          "value": "24rem"
        },
        "md": {
          "value": "28rem"
        },
        "lg": {
          "value": "32rem"
        },
        "xl": {
          "value": "36rem"
        },
        "2xl": {
          "value": "42rem"
        },
        "3xl": {
          "value": "48rem"
        },
        "4xl": {
          "value": "56rem"
        },
        "5xl": {
          "value": "64rem"
        },
        "6xl": {
          "value": "72rem"
        },
        "7xl": {
          "value": "80rem"
        },
        "full": {
          "value": "100%"
        }
      },
      "space": {
        "0": {
          "value": "0px"
        },
        "1": {
          "value": "0.25rem"
        },
        "2": {
          "value": "0.5rem"
        },
        "3": {
          "value": "0.75rem"
        },
        "4": {
          "value": "1rem"
        },
        "5": {
          "value": "1.25rem"
        },
        "6": {
          "value": "1.5rem"
        },
        "7": {
          "value": "1.75rem"
        },
        "8": {
          "value": "2rem"
        },
        "9": {
          "value": "2.25rem"
        },
        "10": {
          "value": "2.5rem"
        },
        "11": {
          "value": "2.75rem"
        },
        "12": {
          "value": "3rem"
        },
        "14": {
          "value": "3.5rem"
        },
        "16": {
          "value": "4rem"
        },
        "20": {
          "value": "5rem"
        },
        "24": {
          "value": "6rem"
        },
        "28": {
          "value": "7rem"
        },
        "32": {
          "value": "8rem"
        },
        "36": {
          "value": "9rem"
        },
        "40": {
          "value": "10rem"
        },
        "44": {
          "value": "11rem"
        },
        "48": {
          "value": "12rem"
        },
        "52": {
          "value": "13rem"
        },
        "56": {
          "value": "14rem"
        },
        "60": {
          "value": "15rem"
        },
        "64": {
          "value": "16rem"
        },
        "72": {
          "value": "18rem"
        },
        "80": {
          "value": "20rem"
        },
        "96": {
          "value": "24rem"
        },
        "128": {
          "value": "32rem"
        },
        "px": {
          "value": "1px"
        },
        "rem": {
          "125": {
            "value": "0.125rem"
          },
          "375": {
            "value": "0.375rem"
          },
          "625": {
            "value": "0.625rem"
          },
          "875": {
            "value": "0.875rem"
          }
        }
      },
      "borderWidth": {
        "noBorder": {
          "value": "0"
        },
        "sm": {
          "value": "1px"
        },
        "md": {
          "value": "2px"
        },
        "lg": {
          "value": "3px"
        }
      },
      "opacity": {
        "noOpacity": {
          "value": "0"
        },
        "bright": {
          "value": "0.1"
        },
        "light": {
          "value": "0.15"
        },
        "soft": {
          "value": "0.3"
        },
        "medium": {
          "value": "0.5"
        },
        "high": {
          "value": "0.8"
        },
        "total": {
          "value": "1"
        }
      },
      "font": {
        "sans": {
          "value": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
        },
        "serif": {
          "value": "ui-serif, Georgia, Cambria, Times New Roman, Times, serif"
        },
        "mono": {
          "value": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
        }
      },
      "fontWeight": {
        "thin": {
          "value": "100"
        },
        "extralight": {
          "value": "200"
        },
        "light": {
          "value": "300"
        },
        "normal": {
          "value": "400"
        },
        "medium": {
          "value": "500"
        },
        "semibold": {
          "value": "600"
        },
        "bold": {
          "value": "700"
        },
        "extrabold": {
          "value": "800"
        },
        "black": {
          "value": "900"
        }
      },
      "fontSize": {
        "xs": {
          "value": "0.75rem"
        },
        "sm": {
          "value": "0.875rem"
        },
        "base": {
          "value": "1rem"
        },
        "lg": {
          "value": "1.125rem"
        },
        "xl": {
          "value": "1.25rem"
        },
        "2xl": {
          "value": "1.5rem"
        },
        "3xl": {
          "value": "1.875rem"
        },
        "4xl": {
          "value": "2.25rem"
        },
        "5xl": {
          "value": "3rem"
        },
        "6xl": {
          "value": "3.75rem"
        },
        "7xl": {
          "value": "4.5rem"
        },
        "8xl": {
          "value": "6rem"
        },
        "9xl": {
          "value": "8rem"
        }
      },
      "letterSpacing": {
        "tighter": {
          "value": "-0.05em"
        },
        "tight": {
          "value": "-0.025em"
        },
        "normal": {
          "value": "0em"
        },
        "wide": {
          "value": "0.025em"
        },
        "wider": {
          "value": "0.05em"
        },
        "widest": {
          "value": "0.1em"
        }
      },
      "lead": {
        "1": {
          "value": ".025rem"
        },
        "2": {
          "value": ".5rem"
        },
        "3": {
          "value": ".75rem"
        },
        "4": {
          "value": "1rem"
        },
        "5": {
          "value": "1.25rem"
        },
        "6": {
          "value": "1.5rem"
        },
        "7": {
          "value": "1.75rem"
        },
        "8": {
          "value": "2rem"
        },
        "9": {
          "value": "2.25rem"
        },
        "10": {
          "value": "2.5rem"
        },
        "none": {
          "value": "1"
        },
        "tight": {
          "value": "1.25"
        },
        "snug": {
          "value": "1.375"
        },
        "normal": {
          "value": "1.5"
        },
        "relaxed": {
          "value": "1.625"
        },
        "loose": {
          "value": "2"
        }
      },
      "text": {
        "xs": {
          "fontSize": {
            "value": "{fontSize.xs}"
          },
          "lineHeight": {
            "value": "{lead.4}"
          }
        },
        "sm": {
          "fontSize": {
            "value": "{fontSize.sm}"
          },
          "lineHeight": {
            "value": "{lead.5}"
          }
        },
        "base": {
          "fontSize": {
            "value": "{fontSize.base}"
          },
          "lineHeight": {
            "value": "{lead.6}"
          }
        },
        "lg": {
          "fontSize": {
            "value": "{fontSize.lg}"
          },
          "lineHeight": {
            "value": "{lead.7}"
          }
        },
        "xl": {
          "fontSize": {
            "value": "{fontSize.xl}"
          },
          "lineHeight": {
            "value": "{lead.7}"
          }
        },
        "2xl": {
          "fontSize": {
            "value": "{fontSize.2xl}"
          },
          "lineHeight": {
            "value": "{lead.8}"
          }
        },
        "3xl": {
          "fontSize": {
            "value": "{fontSize.3xl}"
          },
          "lineHeight": {
            "value": "{lead.9}"
          }
        },
        "4xl": {
          "fontSize": {
            "value": "{fontSize.4xl}"
          },
          "lineHeight": {
            "value": "{lead.10}"
          }
        },
        "5xl": {
          "fontSize": {
            "value": "{fontSize.5xl}"
          },
          "lineHeight": {
            "value": "{lead.none}"
          }
        },
        "6xl": {
          "fontSize": {
            "value": "{fontSize.6xl}"
          },
          "lineHeight": {
            "value": "{lead.none}"
          }
        }
      },
      "elements": {
        "text": {
          "primary": {
            "color": {
              "static": {
                "value": {
                  "initial": "{color.gray.900}",
                  "dark": "{color.gray.50}"
                }
              },
              "hover": {}
            }
          },
          "secondary": {
            "color": {
              "static": {
                "value": {
                  "initial": "{color.gray.500}",
                  "dark": "{color.gray.400}"
                }
              },
              "hover": {
                "value": {
                  "initial": "{color.gray.700}",
                  "dark": "{color.gray.200}"
                }
              }
            }
          }
        },
        "container": {
          "maxWidth": {
            "value": "80rem"
          },
          "padding": {
            "mobile": {
              "value": "{space.4}"
            },
            "xs": {
              "value": "{space.4}"
            },
            "sm": {
              "value": "{space.6}"
            },
            "md": {
              "value": "{space.6}"
            }
          }
        },
        "backdrop": {
          "filter": {
            "value": "saturate(200%) blur(20px)"
          },
          "background": {
            "value": {
              "initial": "#fffc",
              "dark": "#0c0d0ccc"
            }
          }
        },
        "border": {
          "primary": {
            "static": {
              "value": {
                "initial": "{color.gray.100}",
                "dark": "{color.gray.900}"
              }
            },
            "hover": {
              "value": {
                "initial": "{color.gray.200}",
                "dark": "{color.gray.800}"
              }
            }
          },
          "secondary": {
            "static": {
              "value": {
                "initial": "{color.gray.200}",
                "dark": "{color.gray.800}"
              }
            },
            "hover": {
              "value": {
                "initial": "",
                "dark": ""
              }
            }
          }
        },
        "surface": {
          "background": {
            "base": {
              "value": {
                "initial": "{color.gray.100}",
                "dark": "{color.gray.900}"
              }
            }
          },
          "primary": {
            "backgroundColor": {
              "value": {
                "initial": "{color.gray.100}",
                "dark": "{color.gray.900}"
              }
            }
          },
          "secondary": {
            "backgroundColor": {
              "value": {
                "initial": "{color.gray.200}",
                "dark": "{color.gray.800}"
              }
            }
          }
        },
        "state": {
          "primary": {
            "color": {
              "primary": {
                "value": {
                  "initial": "{color.primary.600}",
                  "dark": "{color.primary.400}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.primary.700}",
                  "dark": "{color.primary.200}"
                }
              }
            },
            "backgroundColor": {
              "primary": {
                "value": {
                  "initial": "{color.primary.50}",
                  "dark": "{color.primary.900}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.primary.100}",
                  "dark": "{color.primary.800}"
                }
              }
            },
            "borderColor": {
              "primary": {
                "value": {
                  "initial": "{color.primary.100}",
                  "dark": "{color.primary.800}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.primary.200}",
                  "dark": "{color.primary.700}"
                }
              }
            }
          },
          "info": {
            "color": {
              "primary": {
                "value": {
                  "initial": "{color.blue.500}",
                  "dark": "{color.blue.400}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.blue.600}",
                  "dark": "{color.blue.200}"
                }
              }
            },
            "backgroundColor": {
              "primary": {
                "value": {
                  "initial": "{color.blue.50}",
                  "dark": "{color.blue.900}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.blue.100}",
                  "dark": "{color.blue.800}"
                }
              }
            },
            "borderColor": {
              "primary": {
                "value": {
                  "initial": "{color.blue.100}",
                  "dark": "{color.blue.800}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.blue.200}",
                  "dark": "{color.blue.700}"
                }
              }
            }
          },
          "success": {
            "color": {
              "primary": {
                "value": {
                  "initial": "{color.green.500}",
                  "dark": "{color.green.400}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.green.600}",
                  "dark": "{color.green.200}"
                }
              }
            },
            "backgroundColor": {
              "primary": {
                "value": {
                  "initial": "{color.green.50}",
                  "dark": "{color.green.900}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.green.100}",
                  "dark": "{color.green.800}"
                }
              }
            },
            "borderColor": {
              "primary": {
                "value": {
                  "initial": "{color.green.100}",
                  "dark": "{color.green.800}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.green.200}",
                  "dark": "{color.green.700}"
                }
              }
            }
          },
          "warning": {
            "color": {
              "primary": {
                "value": {
                  "initial": "{color.yellow.600}",
                  "dark": "{color.yellow.400}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.yellow.700}",
                  "dark": "{color.yellow.200}"
                }
              }
            },
            "backgroundColor": {
              "primary": {
                "value": {
                  "initial": "{color.yellow.50}",
                  "dark": "{color.yellow.900}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.yellow.100}",
                  "dark": "{color.yellow.800}"
                }
              }
            },
            "borderColor": {
              "primary": {
                "value": {
                  "initial": "{color.yellow.100}",
                  "dark": "{color.yellow.800}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.yellow.200}",
                  "dark": "{color.yellow.700}"
                }
              }
            }
          },
          "danger": {
            "color": {
              "primary": {
                "value": {
                  "initial": "{color.red.500}",
                  "dark": "{color.red.300}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.red.600}",
                  "dark": "{color.red.200}"
                }
              }
            },
            "backgroundColor": {
              "primary": {
                "value": {
                  "initial": "{color.red.50}",
                  "dark": "{color.red.900}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.red.100}",
                  "dark": "{color.red.800}"
                }
              }
            },
            "borderColor": {
              "primary": {
                "value": {
                  "initial": "{color.red.100}",
                  "dark": "{color.red.800}"
                }
              },
              "secondary": {
                "value": {
                  "initial": "{color.red.200}",
                  "dark": "{color.red.700}"
                }
              }
            }
          }
        }
      },
      "typography": {
        "body": {
          "color": {
            "value": {
              "initial": "{color.black}",
              "dark": "{color.white}"
            }
          },
          "backgroundColor": {
            "value": {
              "initial": "{color.white}",
              "dark": "{color.black}"
            }
          }
        },
        "verticalMargin": {
          "sm": {
            "value": "16px"
          },
          "base": {
            "value": "24px"
          }
        },
        "letterSpacing": {
          "tight": {
            "value": "-0.025em"
          },
          "wide": {
            "value": "0.025em"
          }
        },
        "fontSize": {
          "xs": {
            "value": "12px"
          },
          "sm": {
            "value": "14px"
          },
          "base": {
            "value": "16px"
          },
          "lg": {
            "value": "18px"
          },
          "xl": {
            "value": "20px"
          },
          "2xl": {
            "value": "24px"
          },
          "3xl": {
            "value": "30px"
          },
          "4xl": {
            "value": "36px"
          },
          "5xl": {
            "value": "48px"
          },
          "6xl": {
            "value": "60px"
          },
          "7xl": {
            "value": "72px"
          },
          "8xl": {
            "value": "96px"
          },
          "9xl": {
            "value": "128px"
          }
        },
        "fontWeight": {
          "thin": {
            "value": "100"
          },
          "extralight": {
            "value": "200"
          },
          "light": {
            "value": "300"
          },
          "normal": {
            "value": "400"
          },
          "medium": {
            "value": "500"
          },
          "semibold": {
            "value": "600"
          },
          "bold": {
            "value": "700"
          },
          "extrabold": {
            "value": "800"
          },
          "black": {
            "value": "900"
          }
        },
        "lead": {
          "1": {
            "value": ".025rem"
          },
          "2": {
            "value": ".5rem"
          },
          "3": {
            "value": ".75rem"
          },
          "4": {
            "value": "1rem"
          },
          "5": {
            "value": "1.25rem"
          },
          "6": {
            "value": "1.5rem"
          },
          "7": {
            "value": "1.75rem"
          },
          "8": {
            "value": "2rem"
          },
          "9": {
            "value": "2.25rem"
          },
          "10": {
            "value": "2.5rem"
          },
          "none": {
            "value": "1"
          },
          "tight": {
            "value": "1.25"
          },
          "snug": {
            "value": "1.375"
          },
          "normal": {
            "value": "1.5"
          },
          "relaxed": {
            "value": "1.625"
          },
          "loose": {
            "value": "2"
          }
        },
        "font": {
          "display": {
            "value": "{font.sans}"
          },
          "body": {
            "value": "{font.sans}"
          },
          "code": {
            "value": "{font.mono}"
          }
        },
        "color": {
          "primary": {
            "50": {
              "value": "{color.primary.50}"
            },
            "100": {
              "value": "{color.primary.100}"
            },
            "200": {
              "value": "{color.primary.200}"
            },
            "300": {
              "value": "{color.primary.300}"
            },
            "400": {
              "value": "{color.primary.400}"
            },
            "500": {
              "value": "{color.primary.500}"
            },
            "600": {
              "value": "{color.primary.600}"
            },
            "700": {
              "value": "{color.primary.700}"
            },
            "800": {
              "value": "{color.primary.800}"
            },
            "900": {
              "value": "{color.primary.900}"
            }
          },
          "secondary": {
            "50": {
              "value": "{color.gray.50}"
            },
            "100": {
              "value": "{color.gray.100}"
            },
            "200": {
              "value": "{color.gray.200}"
            },
            "300": {
              "value": "{color.gray.300}"
            },
            "400": {
              "value": "{color.gray.400}"
            },
            "500": {
              "value": "{color.gray.500}"
            },
            "600": {
              "value": "{color.gray.600}"
            },
            "700": {
              "value": "{color.gray.700}"
            },
            "800": {
              "value": "{color.gray.800}"
            },
            "900": {
              "value": "{color.gray.900}"
            }
          }
        }
      },
      "prose": {
        "p": {
          "fontSize": {
            "value": "{typography.fontSize.base}"
          },
          "lineHeight": {
            "value": "{typography.lead.normal}"
          },
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "br": {
            "margin": {
              "value": "{typography.verticalMargin.base} 0 0 0"
            }
          }
        },
        "h1": {
          "margin": {
            "value": "0 0 2rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.5xl}"
          },
          "lineHeight": {
            "value": "{typography.lead.tight}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.bold}"
          },
          "letterSpacing": {
            "value": "{typography.letterSpacing.tight}"
          },
          "iconSize": {
            "value": "{typography.fontSize.3xl}"
          }
        },
        "h2": {
          "margin": {
            "value": "3rem 0 2rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.4xl}"
          },
          "lineHeight": {
            "value": "{typography.lead.tight}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          },
          "letterSpacing": {
            "value": "{typography.letterSpacing.tight}"
          },
          "iconSize": {
            "value": "{typography.fontSize.2xl}"
          }
        },
        "h3": {
          "margin": {
            "value": "3rem 0 2rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.3xl}"
          },
          "lineHeight": {
            "value": "{typography.lead.snug}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          },
          "letterSpacing": {
            "value": "{typography.letterSpacing.tight}"
          },
          "iconSize": {
            "value": "{typography.fontSize.xl}"
          }
        },
        "h4": {
          "margin": {
            "value": "3rem 0 2rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.2xl}"
          },
          "lineHeight": {
            "value": "{typography.lead.snug}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          },
          "letterSpacing": {
            "value": "{typography.letterSpacing.tight}"
          },
          "iconSize": {
            "value": "{typography.fontSize.lg}"
          }
        },
        "h5": {
          "margin": {
            "value": "3rem 0 2rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.xl}"
          },
          "lineHeight": {
            "value": "{typography.lead.snug}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          },
          "iconSize": {
            "value": "{typography.fontSize.lg}"
          }
        },
        "h6": {
          "margin": {
            "value": "3rem 0 2rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.lg}"
          },
          "lineHeight": {
            "value": "{typography.lead.normal}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          },
          "iconSize": {
            "value": "{typography.fontSize.base}"
          }
        },
        "strong": {
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          }
        },
        "img": {
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          }
        },
        "a": {
          "textDecoration": {
            "value": "none"
          },
          "color": {
            "static": {
              "value": {
                "initial": "inherit",
                "dark": "inherit"
              }
            },
            "hover": {
              "value": {
                "initial": "{typography.color.primary.500}",
                "dark": "{typography.color.primary.400}"
              }
            }
          },
          "border": {
            "width": {
              "value": "1px"
            },
            "style": {
              "static": {
                "value": "dashed"
              },
              "hover": {
                "value": "solid"
              }
            },
            "color": {
              "static": {
                "value": {
                  "initial": "currentColor",
                  "dark": "currentColor"
                }
              },
              "hover": {
                "value": {
                  "initial": "currentColor",
                  "dark": "currentColor"
                }
              }
            },
            "distance": {
              "value": "2px"
            }
          },
          "fontWeight": {
            "value": "{typography.fontWeight.medium}"
          },
          "hasCode": {
            "borderBottom": {
              "value": "none"
            }
          },
          "code": {
            "border": {
              "width": {
                "value": "{prose.a.border.width}"
              },
              "style": {
                "value": "{prose.a.border.style.static}"
              },
              "color": {
                "static": {
                  "value": {
                    "initial": "{typography.color.secondary.400}",
                    "dark": "{typography.color.secondary.600}"
                  }
                },
                "hover": {
                  "value": {
                    "initial": "{typography.color.primary.500}",
                    "dark": "{typography.color.primary.600}"
                  }
                }
              }
            },
            "color": {
              "static": {
                "value": {
                  "initial": "currentColor",
                  "dark": "currentColor"
                }
              },
              "hover": {
                "value": {
                  "initial": "currentColor",
                  "dark": "currentColor"
                }
              }
            },
            "background": {
              "static": {},
              "hover": {
                "value": {
                  "initial": "{typography.color.primary.50}",
                  "dark": "{typography.color.primary.900}"
                }
              }
            }
          }
        },
        "blockquote": {
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "paddingInlineStart": {
            "value": "24px"
          },
          "quotes": {
            "value": "'201C' '201D' '2018' '2019'"
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.500}",
              "dark": "{typography.color.secondary.400}"
            }
          },
          "border": {
            "width": {
              "value": "4px"
            },
            "style": {
              "value": "solid"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.200}",
                "dark": "{typography.color.secondary.700}"
              }
            }
          }
        },
        "ul": {
          "listStyleType": {
            "value": "disc"
          },
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "paddingInlineStart": {
            "value": "21px"
          },
          "li": {
            "markerColor": {
              "value": {
                "initial": "currentColor",
                "dark": "currentColor"
              }
            }
          }
        },
        "ol": {
          "listStyleType": {
            "value": "decimal"
          },
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "paddingInlineStart": {
            "value": "21px"
          },
          "li": {
            "markerColor": {
              "value": {
                "initial": "currentColor",
                "dark": "currentColor"
              }
            }
          }
        },
        "li": {
          "margin": {
            "value": "{typography.verticalMargin.sm} 0"
          },
          "listStylePosition": {
            "value": "outside"
          }
        },
        "hr": {
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "style": {
            "value": "solid"
          },
          "width": {
            "value": "1px"
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.200}",
              "dark": "{typography.color.secondary.800}"
            }
          }
        },
        "table": {
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "textAlign": {
            "value": "start"
          },
          "fontSize": {
            "value": "{typography.fontSize.sm}"
          },
          "lineHeight": {
            "value": "{typography.lead.6}"
          }
        },
        "thead": {
          "border": {
            "width": {
              "value": "0px"
            },
            "style": {
              "value": "solid"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.300}",
                "dark": "{typography.color.secondary.600}"
              }
            }
          },
          "borderBottom": {
            "width": {
              "value": "1px"
            },
            "style": {
              "value": "solid"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.200}",
                "dark": "{typography.color.secondary.800}"
              }
            }
          }
        },
        "th": {
          "color": {
            "value": {
              "initial": "{typography.color.secondary.600}",
              "dark": "{typography.color.secondary.400}"
            }
          },
          "padding": {
            "value": "0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.semibold}"
          },
          "textAlign": {
            "value": "inherit"
          }
        },
        "tbody": {
          "tr": {
            "borderBottom": {
              "width": {
                "value": "1px"
              },
              "style": {
                "value": "dashed"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.200}",
                  "dark": "{typography.color.secondary.800}"
                }
              }
            }
          },
          "td": {
            "padding": {
              "value": "{typography.verticalMargin.sm}"
            }
          },
          "code": {
            "inline": {
              "fontSize": {
                "value": "{typography.fontSize.sm}"
              }
            }
          }
        },
        "code": {
          "block": {
            "fontSize": {
              "value": "{typography.fontSize.sm}"
            },
            "margin": {
              "value": "{typography.verticalMargin.base} 0"
            },
            "border": {
              "width": {
                "value": "1px"
              },
              "style": {
                "value": "solid"
              },
              "color": {
                "value": {
                  "initial": "{typography.color.secondary.200}",
                  "dark": "{typography.color.secondary.800}"
                }
              }
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.700}",
                "dark": "{typography.color.secondary.200}"
              }
            },
            "backgroundColor": {
              "value": {
                "initial": "{typography.color.secondary.100}",
                "dark": "{typography.color.secondary.900}"
              }
            },
            "backdropFilter": {
              "value": {
                "initial": "contrast(1)",
                "dark": "contrast(1)"
              }
            },
            "pre": {
              "padding": {
                "value": "{typography.verticalMargin.sm}"
              }
            }
          },
          "inline": {
            "borderRadius": {
              "value": "{radii.xs}"
            },
            "padding": {
              "value": "0.2rem 0.375rem 0.2rem 0.375rem"
            },
            "fontSize": {
              "value": "{typography.fontSize.sm}"
            },
            "fontWeight": {
              "value": "{typography.fontWeight.normal}"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.700}",
                "dark": "{typography.color.secondary.200}"
              }
            },
            "backgroundColor": {
              "value": {
                "initial": "{typography.color.secondary.100}",
                "dark": "{typography.color.secondary.800}"
              }
            }
          }
        }
      },
      "docus": {
        "body": {
          "backgroundColor": {
            "value": {
              "initial": "{color.white}",
              "dark": "{color.black}"
            }
          },
          "color": {
            "value": {
              "initial": "{color.gray.800}",
              "dark": "{color.gray.200}"
            }
          },
          "fontFamily": {
            "value": "{font.sans}"
          }
        },
        "header": {
          "height": {
            "value": "64px"
          },
          "logo": {
            "height": {
              "value": {
                "initial": "{space.6}",
                "sm": "{space.7}"
              }
            }
          },
          "title": {
            "fontSize": {
              "value": "{fontSize.2xl}"
            },
            "fontWeight": {
              "value": "{fontWeight.bold}"
            },
            "color": {
              "static": {
                "value": {
                  "initial": "{color.gray.900}",
                  "dark": "{color.gray.100}"
                }
              },
              "hover": {
                "value": "{color.primary.500}"
              }
            }
          }
        },
        "footer": {
          "height": {
            "value": {
              "initial": "145px",
              "sm": "100px"
            }
          },
          "padding": {
            "value": "{space.4} 0"
          }
        },
        "readableLine": {
          "value": "78ch"
        },
        "loadingBar": {
          "height": {
            "value": "3px"
          },
          "gradientColorStop1": {
            "value": "#00dc82"
          },
          "gradientColorStop2": {
            "value": "#34cdfe"
          },
          "gradientColorStop3": {
            "value": "#0047e1"
          }
        },
        "search": {
          "backdropFilter": {
            "value": "blur(24px)"
          },
          "input": {
            "borderRadius": {
              "value": "{radii.2xs}"
            },
            "borderWidth": {
              "value": "1px"
            },
            "borderStyle": {
              "value": "solid"
            },
            "borderColor": {
              "value": {
                "initial": "{color.gray.200}",
                "dark": "transparent"
              }
            },
            "fontSize": {
              "value": "{fontSize.sm}"
            },
            "gap": {
              "value": "{space.2}"
            },
            "padding": {
              "value": "{space.2} {space.4}"
            },
            "backgroundColor": {
              "value": {
                "initial": "{color.gray.200}",
                "dark": "{color.gray.800}"
              }
            }
          },
          "results": {
            "window": {
              "marginX": {
                "value": {
                  "initial": "0",
                  "sm": "{space.4}"
                }
              },
              "borderRadius": {
                "value": {
                  "initial": "none",
                  "sm": "{radii.xs}"
                }
              },
              "marginTop": {
                "value": {
                  "initial": "0",
                  "sm": "20vh"
                }
              },
              "maxWidth": {
                "value": "640px"
              },
              "maxHeight": {
                "value": {
                  "initial": "100%",
                  "sm": "320px"
                }
              }
            },
            "selected": {
              "backgroundColor": {
                "value": {
                  "initial": "{color.gray.300}",
                  "dark": "{color.gray.700}"
                }
              }
            },
            "highlight": {
              "color": {
                "value": "white"
              },
              "backgroundColor": {
                "value": "{color.primary.500}"
              }
            }
          }
        }
      }
    }
  },
  "default": {
    "media": {
      "xs": {
        "value": "(min-width: 475px)"
      },
      "sm": {
        "value": "(min-width: 640px)"
      },
      "md": {
        "value": "(min-width: 768px)"
      },
      "lg": {
        "value": "(min-width: 1024px)"
      },
      "xl": {
        "value": "(min-width: 1280px)"
      },
      "2xl": {
        "value": "(min-width: 1536px)"
      },
      "rm": {
        "value": "(prefers-reduced-motion: reduce)"
      },
      "landscape": {
        "value": "only screen and (orientation: landscape)"
      },
      "portrait": {
        "value": "only screen and (orientation: portrait)"
      }
    },
    "color": {
      "white": {
        "value": "#ffffff"
      },
      "black": {
        "value": "#0B0A0A"
      },
      "gray": {
        "50": {
          "value": "#FBFBFB"
        },
        "100": {
          "value": "#F6F5F4"
        },
        "200": {
          "value": "#ECEBE8"
        },
        "300": {
          "value": "#DBD9D3"
        },
        "400": {
          "value": "#ADA9A4"
        },
        "500": {
          "value": "#97948F"
        },
        "600": {
          "value": "#67635D"
        },
        "700": {
          "value": "#36332E"
        },
        "800": {
          "value": "#201E1B"
        },
        "900": {
          "value": "#121110"
        }
      },
      "green": {
        "50": {
          "value": "#ECFFF7"
        },
        "100": {
          "value": "#DEFFF1"
        },
        "200": {
          "value": "#C3FFE6"
        },
        "300": {
          "value": "#86FBCB"
        },
        "400": {
          "value": "#3CEEA5"
        },
        "500": {
          "value": "#0DD885"
        },
        "600": {
          "value": "#00B467"
        },
        "700": {
          "value": "#006037"
        },
        "800": {
          "value": "#002817"
        },
        "900": {
          "value": "#00190F"
        }
      },
      "yellow": {
        "50": {
          "value": "#FFFCEE"
        },
        "100": {
          "value": "#FFF6D3"
        },
        "200": {
          "value": "#FFF0B1"
        },
        "300": {
          "value": "#FFE372"
        },
        "400": {
          "value": "#FFDC4E"
        },
        "500": {
          "value": "#FBCA05"
        },
        "600": {
          "value": "#CBA408"
        },
        "700": {
          "value": "#614E02"
        },
        "800": {
          "value": "#292100"
        },
        "900": {
          "value": "#1B1500"
        }
      },
      "orange": {
        "50": {
          "value": "#ffe9d9"
        },
        "100": {
          "value": "#ffd3b3"
        },
        "200": {
          "value": "#ffbd8d"
        },
        "300": {
          "value": "#ffa666"
        },
        "400": {
          "value": "#ff9040"
        },
        "500": {
          "value": "#ff7a1a"
        },
        "600": {
          "value": "#e15e00"
        },
        "700": {
          "value": "#a94700"
        },
        "800": {
          "value": "#702f00"
        },
        "900": {
          "value": "#381800"
        }
      },
      "red": {
        "50": {
          "value": "#FFF9F8"
        },
        "100": {
          "value": "#FFF3F0"
        },
        "200": {
          "value": "#FFDED7"
        },
        "300": {
          "value": "#FFA692"
        },
        "400": {
          "value": "#FF7353"
        },
        "500": {
          "value": "#FF3B10"
        },
        "600": {
          "value": "#BB2402"
        },
        "700": {
          "value": "#701704"
        },
        "800": {
          "value": "#340A01"
        },
        "900": {
          "value": "#1C0301"
        }
      },
      "pear": {
        "50": {
          "value": "#f7f8dc"
        },
        "100": {
          "value": "#eff0ba"
        },
        "200": {
          "value": "#e8e997"
        },
        "300": {
          "value": "#e0e274"
        },
        "400": {
          "value": "#d8da52"
        },
        "500": {
          "value": "#d0d32f"
        },
        "600": {
          "value": "#a8aa24"
        },
        "700": {
          "value": "#7e801b"
        },
        "800": {
          "value": "#545512"
        },
        "900": {
          "value": "#2a2b09"
        }
      },
      "teal": {
        "50": {
          "value": "#d7faf8"
        },
        "100": {
          "value": "#aff4f0"
        },
        "200": {
          "value": "#87efe9"
        },
        "300": {
          "value": "#5fe9e1"
        },
        "400": {
          "value": "#36e4da"
        },
        "500": {
          "value": "#1cd1c6"
        },
        "600": {
          "value": "#16a79e"
        },
        "700": {
          "value": "#117d77"
        },
        "800": {
          "value": "#0b544f"
        },
        "900": {
          "value": "#062a28"
        }
      },
      "lightblue": {
        "50": {
          "value": "#d9f8ff"
        },
        "100": {
          "value": "#b3f1ff"
        },
        "200": {
          "value": "#8deaff"
        },
        "300": {
          "value": "#66e4ff"
        },
        "400": {
          "value": "#40ddff"
        },
        "500": {
          "value": "#1ad6ff"
        },
        "600": {
          "value": "#00b9e1"
        },
        "700": {
          "value": "#008aa9"
        },
        "800": {
          "value": "#005c70"
        },
        "900": {
          "value": "#002e38"
        }
      },
      "blue": {
        "50": {
          "value": "#F2FAFF"
        },
        "100": {
          "value": "#DFF3FF"
        },
        "200": {
          "value": "#C6EAFF"
        },
        "300": {
          "value": "#A1DDFF"
        },
        "400": {
          "value": "#64C7FF"
        },
        "500": {
          "value": "#1AADFF"
        },
        "600": {
          "value": "#0069A6"
        },
        "700": {
          "value": "#014267"
        },
        "800": {
          "value": "#002235"
        },
        "900": {
          "value": "#00131D"
        }
      },
      "indigoblue": {
        "50": {
          "value": "#d9e5ff"
        },
        "100": {
          "value": "#b3cbff"
        },
        "200": {
          "value": "#8db0ff"
        },
        "300": {
          "value": "#6696ff"
        },
        "400": {
          "value": "#407cff"
        },
        "500": {
          "value": "#1a62ff"
        },
        "600": {
          "value": "#0047e1"
        },
        "700": {
          "value": "#0035a9"
        },
        "800": {
          "value": "#002370"
        },
        "900": {
          "value": "#001238"
        }
      },
      "royalblue": {
        "50": {
          "value": "#dfdbfb"
        },
        "100": {
          "value": "#c0b7f7"
        },
        "200": {
          "value": "#a093f3"
        },
        "300": {
          "value": "#806ff0"
        },
        "400": {
          "value": "#614bec"
        },
        "500": {
          "value": "#4127e8"
        },
        "600": {
          "value": "#2c15c4"
        },
        "700": {
          "value": "#211093"
        },
        "800": {
          "value": "#160a62"
        },
        "900": {
          "value": "#0b0531"
        }
      },
      "purple": {
        "50": {
          "value": "#ead9ff"
        },
        "100": {
          "value": "#d5b3ff"
        },
        "200": {
          "value": "#c08dff"
        },
        "300": {
          "value": "#ab66ff"
        },
        "400": {
          "value": "#9640ff"
        },
        "500": {
          "value": "#811aff"
        },
        "600": {
          "value": "#6500e1"
        },
        "700": {
          "value": "#4c00a9"
        },
        "800": {
          "value": "#330070"
        },
        "900": {
          "value": "#190038"
        }
      },
      "pink": {
        "50": {
          "value": "#ffd9f2"
        },
        "100": {
          "value": "#ffb3e5"
        },
        "200": {
          "value": "#ff8dd8"
        },
        "300": {
          "value": "#ff66cc"
        },
        "400": {
          "value": "#ff40bf"
        },
        "500": {
          "value": "#ff1ab2"
        },
        "600": {
          "value": "#e10095"
        },
        "700": {
          "value": "#a90070"
        },
        "800": {
          "value": "#70004b"
        },
        "900": {
          "value": "#380025"
        }
      },
      "ruby": {
        "50": {
          "value": "#ffd9e4"
        },
        "100": {
          "value": "#ffb3c9"
        },
        "200": {
          "value": "#ff8dae"
        },
        "300": {
          "value": "#ff6694"
        },
        "400": {
          "value": "#ff4079"
        },
        "500": {
          "value": "#ff1a5e"
        },
        "600": {
          "value": "#e10043"
        },
        "700": {
          "value": "#a90032"
        },
        "800": {
          "value": "#700021"
        },
        "900": {
          "value": "#380011"
        }
      },
      "primary": {
        "50": {
          "value": "#F1FCFF"
        },
        "100": {
          "value": "#DCF7FF"
        },
        "200": {
          "value": "#C5F2FF"
        },
        "300": {
          "value": "#82E3FF"
        },
        "400": {
          "value": "#55E1FF"
        },
        "500": {
          "value": "#1AD6FF"
        },
        "600": {
          "value": "#09A0C1"
        },
        "700": {
          "value": "#024757"
        },
        "800": {
          "value": "#00232B"
        },
        "900": {
          "value": "#001A1F"
        }
      },
      "secondary": {
        "50": {
          "value": "{color.gray.50}"
        },
        "100": {
          "value": "{color.gray.100}"
        },
        "200": {
          "value": "{color.gray.200}"
        },
        "300": {
          "value": "{color.gray.300}"
        },
        "400": {
          "value": "{color.gray.400}"
        },
        "500": {
          "value": "{color.gray.500}"
        },
        "600": {
          "value": "{color.gray.600}"
        },
        "700": {
          "value": "{color.gray.700}"
        },
        "800": {
          "value": "{color.gray.800}"
        },
        "900": {
          "value": "{color.gray.900}"
        }
      },
      "shadow": {
        "value": {
          "initial": "{color.gray.400}",
          "dark": "{color.gray.800}"
        }
      }
    },
    "width": {
      "screen": {
        "value": "100vw"
      }
    },
    "height": {
      "screen": {
        "value": "100vh"
      }
    },
    "shadow": {
      "xs": {
        "value": "0px 1px 2px 0px {color.shadow}"
      },
      "sm": {
        "value": "0px 1px 3px 0px {color.shadow}, 0px 1px 2px -1px {color.shadow}"
      },
      "md": {
        "value": "0px 4px 6px -1px {color.shadow}, 0px 2px 4px -2px {color.shadow}"
      },
      "lg": {
        "value": "0px 10px 15px -3px {color.shadow}, 0px 4px 6px -4px {color.shadow}"
      },
      "xl": {
        "value": "0px 20px 25px -5px {color.shadow}, 0px 8px 10px -6px {color.shadow}"
      },
      "2xl": {
        "value": "0px 25px 50px -12px {color.shadow}"
      },
      "none": {
        "value": "0px 0px 0px 0px transparent"
      }
    },
    "radii": {
      "none": {
        "value": "0px"
      },
      "2xs": {
        "value": "0.125rem"
      },
      "xs": {
        "value": "0.25rem"
      },
      "sm": {
        "value": "0.375rem"
      },
      "md": {
        "value": "0.5rem"
      },
      "lg": {
        "value": "0.75rem"
      },
      "xl": {
        "value": "1rem"
      },
      "2xl": {
        "value": "1.5rem"
      },
      "3xl": {
        "value": "1.75rem"
      },
      "full": {
        "value": "9999px"
      }
    },
    "size": {
      "0": {
        "value": "0px"
      },
      "2": {
        "value": "2px"
      },
      "4": {
        "value": "4px"
      },
      "6": {
        "value": "6px"
      },
      "8": {
        "value": "8px"
      },
      "12": {
        "value": "12px"
      },
      "16": {
        "value": "16px"
      },
      "20": {
        "value": "20px"
      },
      "24": {
        "value": "24px"
      },
      "32": {
        "value": "32px"
      },
      "40": {
        "value": "40px"
      },
      "48": {
        "value": "48px"
      },
      "56": {
        "value": "56px"
      },
      "64": {
        "value": "64px"
      },
      "80": {
        "value": "80px"
      },
      "104": {
        "value": "104px"
      },
      "200": {
        "value": "200px"
      },
      "xs": {
        "value": "20rem"
      },
      "sm": {
        "value": "24rem"
      },
      "md": {
        "value": "28rem"
      },
      "lg": {
        "value": "32rem"
      },
      "xl": {
        "value": "36rem"
      },
      "2xl": {
        "value": "42rem"
      },
      "3xl": {
        "value": "48rem"
      },
      "4xl": {
        "value": "56rem"
      },
      "5xl": {
        "value": "64rem"
      },
      "6xl": {
        "value": "72rem"
      },
      "7xl": {
        "value": "80rem"
      },
      "full": {
        "value": "100%"
      }
    },
    "space": {
      "0": {
        "value": "0px"
      },
      "1": {
        "value": "0.25rem"
      },
      "2": {
        "value": "0.5rem"
      },
      "3": {
        "value": "0.75rem"
      },
      "4": {
        "value": "1rem"
      },
      "5": {
        "value": "1.25rem"
      },
      "6": {
        "value": "1.5rem"
      },
      "7": {
        "value": "1.75rem"
      },
      "8": {
        "value": "2rem"
      },
      "9": {
        "value": "2.25rem"
      },
      "10": {
        "value": "2.5rem"
      },
      "11": {
        "value": "2.75rem"
      },
      "12": {
        "value": "3rem"
      },
      "14": {
        "value": "3.5rem"
      },
      "16": {
        "value": "4rem"
      },
      "20": {
        "value": "5rem"
      },
      "24": {
        "value": "6rem"
      },
      "28": {
        "value": "7rem"
      },
      "32": {
        "value": "8rem"
      },
      "36": {
        "value": "9rem"
      },
      "40": {
        "value": "10rem"
      },
      "44": {
        "value": "11rem"
      },
      "48": {
        "value": "12rem"
      },
      "52": {
        "value": "13rem"
      },
      "56": {
        "value": "14rem"
      },
      "60": {
        "value": "15rem"
      },
      "64": {
        "value": "16rem"
      },
      "72": {
        "value": "18rem"
      },
      "80": {
        "value": "20rem"
      },
      "96": {
        "value": "24rem"
      },
      "128": {
        "value": "32rem"
      },
      "px": {
        "value": "1px"
      },
      "rem": {
        "125": {
          "value": "0.125rem"
        },
        "375": {
          "value": "0.375rem"
        },
        "625": {
          "value": "0.625rem"
        },
        "875": {
          "value": "0.875rem"
        }
      }
    },
    "borderWidth": {
      "noBorder": {
        "value": "0"
      },
      "sm": {
        "value": "1px"
      },
      "md": {
        "value": "2px"
      },
      "lg": {
        "value": "3px"
      }
    },
    "opacity": {
      "noOpacity": {
        "value": "0"
      },
      "bright": {
        "value": "0.1"
      },
      "light": {
        "value": "0.15"
      },
      "soft": {
        "value": "0.3"
      },
      "medium": {
        "value": "0.5"
      },
      "high": {
        "value": "0.8"
      },
      "total": {
        "value": "1"
      }
    },
    "font": {
      "sans": {
        "value": "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
      },
      "serif": {
        "value": "ui-serif, Georgia, Cambria, Times New Roman, Times, serif"
      },
      "mono": {
        "value": "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
      }
    },
    "fontWeight": {
      "thin": {
        "value": "100"
      },
      "extralight": {
        "value": "200"
      },
      "light": {
        "value": "300"
      },
      "normal": {
        "value": "400"
      },
      "medium": {
        "value": "500"
      },
      "semibold": {
        "value": "600"
      },
      "bold": {
        "value": "700"
      },
      "extrabold": {
        "value": "800"
      },
      "black": {
        "value": "900"
      }
    },
    "fontSize": {
      "xs": {
        "value": "0.75rem"
      },
      "sm": {
        "value": "0.875rem"
      },
      "base": {
        "value": "1rem"
      },
      "lg": {
        "value": "1.125rem"
      },
      "xl": {
        "value": "1.25rem"
      },
      "2xl": {
        "value": "1.5rem"
      },
      "3xl": {
        "value": "1.875rem"
      },
      "4xl": {
        "value": "2.25rem"
      },
      "5xl": {
        "value": "3rem"
      },
      "6xl": {
        "value": "3.75rem"
      },
      "7xl": {
        "value": "4.5rem"
      },
      "8xl": {
        "value": "6rem"
      },
      "9xl": {
        "value": "8rem"
      }
    },
    "letterSpacing": {
      "tighter": {
        "value": "-0.05em"
      },
      "tight": {
        "value": "-0.025em"
      },
      "normal": {
        "value": "0em"
      },
      "wide": {
        "value": "0.025em"
      },
      "wider": {
        "value": "0.05em"
      },
      "widest": {
        "value": "0.1em"
      }
    },
    "lead": {
      "1": {
        "value": ".025rem"
      },
      "2": {
        "value": ".5rem"
      },
      "3": {
        "value": ".75rem"
      },
      "4": {
        "value": "1rem"
      },
      "5": {
        "value": "1.25rem"
      },
      "6": {
        "value": "1.5rem"
      },
      "7": {
        "value": "1.75rem"
      },
      "8": {
        "value": "2rem"
      },
      "9": {
        "value": "2.25rem"
      },
      "10": {
        "value": "2.5rem"
      },
      "none": {
        "value": "1"
      },
      "tight": {
        "value": "1.25"
      },
      "snug": {
        "value": "1.375"
      },
      "normal": {
        "value": "1.5"
      },
      "relaxed": {
        "value": "1.625"
      },
      "loose": {
        "value": "2"
      }
    },
    "text": {
      "xs": {
        "fontSize": {
          "value": "{fontSize.xs}"
        },
        "lineHeight": {
          "value": "{lead.4}"
        }
      },
      "sm": {
        "fontSize": {
          "value": "{fontSize.sm}"
        },
        "lineHeight": {
          "value": "{lead.5}"
        }
      },
      "base": {
        "fontSize": {
          "value": "{fontSize.base}"
        },
        "lineHeight": {
          "value": "{lead.6}"
        }
      },
      "lg": {
        "fontSize": {
          "value": "{fontSize.lg}"
        },
        "lineHeight": {
          "value": "{lead.7}"
        }
      },
      "xl": {
        "fontSize": {
          "value": "{fontSize.xl}"
        },
        "lineHeight": {
          "value": "{lead.7}"
        }
      },
      "2xl": {
        "fontSize": {
          "value": "{fontSize.2xl}"
        },
        "lineHeight": {
          "value": "{lead.8}"
        }
      },
      "3xl": {
        "fontSize": {
          "value": "{fontSize.3xl}"
        },
        "lineHeight": {
          "value": "{lead.9}"
        }
      },
      "4xl": {
        "fontSize": {
          "value": "{fontSize.4xl}"
        },
        "lineHeight": {
          "value": "{lead.10}"
        }
      },
      "5xl": {
        "fontSize": {
          "value": "{fontSize.5xl}"
        },
        "lineHeight": {
          "value": "{lead.none}"
        }
      },
      "6xl": {
        "fontSize": {
          "value": "{fontSize.6xl}"
        },
        "lineHeight": {
          "value": "{lead.none}"
        }
      }
    },
    "elements": {
      "text": {
        "primary": {
          "color": {
            "static": {
              "value": {
                "initial": "{color.gray.900}",
                "dark": "{color.gray.50}"
              }
            },
            "hover": {}
          }
        },
        "secondary": {
          "color": {
            "static": {
              "value": {
                "initial": "{color.gray.500}",
                "dark": "{color.gray.400}"
              }
            },
            "hover": {
              "value": {
                "initial": "{color.gray.700}",
                "dark": "{color.gray.200}"
              }
            }
          }
        }
      },
      "container": {
        "maxWidth": {
          "value": "80rem"
        },
        "padding": {
          "mobile": {
            "value": "{space.4}"
          },
          "xs": {
            "value": "{space.4}"
          },
          "sm": {
            "value": "{space.6}"
          },
          "md": {
            "value": "{space.6}"
          }
        }
      },
      "backdrop": {
        "filter": {
          "value": "saturate(200%) blur(20px)"
        },
        "background": {
          "value": {
            "initial": "#fffc",
            "dark": "#0c0d0ccc"
          }
        }
      },
      "border": {
        "primary": {
          "static": {
            "value": {
              "initial": "{color.gray.100}",
              "dark": "{color.gray.900}"
            }
          },
          "hover": {
            "value": {
              "initial": "{color.gray.200}",
              "dark": "{color.gray.800}"
            }
          }
        },
        "secondary": {
          "static": {
            "value": {
              "initial": "{color.gray.200}",
              "dark": "{color.gray.800}"
            }
          },
          "hover": {
            "value": {
              "initial": "",
              "dark": ""
            }
          }
        }
      },
      "surface": {
        "background": {
          "base": {
            "value": {
              "initial": "{color.gray.100}",
              "dark": "{color.gray.900}"
            }
          }
        },
        "primary": {
          "backgroundColor": {
            "value": {
              "initial": "{color.gray.100}",
              "dark": "{color.gray.900}"
            }
          }
        },
        "secondary": {
          "backgroundColor": {
            "value": {
              "initial": "{color.gray.200}",
              "dark": "{color.gray.800}"
            }
          }
        }
      },
      "state": {
        "primary": {
          "color": {
            "primary": {
              "value": {
                "initial": "{color.primary.600}",
                "dark": "{color.primary.400}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.primary.700}",
                "dark": "{color.primary.200}"
              }
            }
          },
          "backgroundColor": {
            "primary": {
              "value": {
                "initial": "{color.primary.50}",
                "dark": "{color.primary.900}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.primary.100}",
                "dark": "{color.primary.800}"
              }
            }
          },
          "borderColor": {
            "primary": {
              "value": {
                "initial": "{color.primary.100}",
                "dark": "{color.primary.800}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.primary.200}",
                "dark": "{color.primary.700}"
              }
            }
          }
        },
        "info": {
          "color": {
            "primary": {
              "value": {
                "initial": "{color.blue.500}",
                "dark": "{color.blue.400}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.blue.600}",
                "dark": "{color.blue.200}"
              }
            }
          },
          "backgroundColor": {
            "primary": {
              "value": {
                "initial": "{color.blue.50}",
                "dark": "{color.blue.900}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.blue.100}",
                "dark": "{color.blue.800}"
              }
            }
          },
          "borderColor": {
            "primary": {
              "value": {
                "initial": "{color.blue.100}",
                "dark": "{color.blue.800}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.blue.200}",
                "dark": "{color.blue.700}"
              }
            }
          }
        },
        "success": {
          "color": {
            "primary": {
              "value": {
                "initial": "{color.green.500}",
                "dark": "{color.green.400}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.green.600}",
                "dark": "{color.green.200}"
              }
            }
          },
          "backgroundColor": {
            "primary": {
              "value": {
                "initial": "{color.green.50}",
                "dark": "{color.green.900}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.green.100}",
                "dark": "{color.green.800}"
              }
            }
          },
          "borderColor": {
            "primary": {
              "value": {
                "initial": "{color.green.100}",
                "dark": "{color.green.800}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.green.200}",
                "dark": "{color.green.700}"
              }
            }
          }
        },
        "warning": {
          "color": {
            "primary": {
              "value": {
                "initial": "{color.yellow.600}",
                "dark": "{color.yellow.400}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.yellow.700}",
                "dark": "{color.yellow.200}"
              }
            }
          },
          "backgroundColor": {
            "primary": {
              "value": {
                "initial": "{color.yellow.50}",
                "dark": "{color.yellow.900}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.yellow.100}",
                "dark": "{color.yellow.800}"
              }
            }
          },
          "borderColor": {
            "primary": {
              "value": {
                "initial": "{color.yellow.100}",
                "dark": "{color.yellow.800}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.yellow.200}",
                "dark": "{color.yellow.700}"
              }
            }
          }
        },
        "danger": {
          "color": {
            "primary": {
              "value": {
                "initial": "{color.red.500}",
                "dark": "{color.red.300}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.red.600}",
                "dark": "{color.red.200}"
              }
            }
          },
          "backgroundColor": {
            "primary": {
              "value": {
                "initial": "{color.red.50}",
                "dark": "{color.red.900}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.red.100}",
                "dark": "{color.red.800}"
              }
            }
          },
          "borderColor": {
            "primary": {
              "value": {
                "initial": "{color.red.100}",
                "dark": "{color.red.800}"
              }
            },
            "secondary": {
              "value": {
                "initial": "{color.red.200}",
                "dark": "{color.red.700}"
              }
            }
          }
        }
      }
    },
    "typography": {
      "body": {
        "color": {
          "value": {
            "initial": "{color.black}",
            "dark": "{color.white}"
          }
        },
        "backgroundColor": {
          "value": {
            "initial": "{color.white}",
            "dark": "{color.black}"
          }
        }
      },
      "verticalMargin": {
        "sm": {
          "value": "16px"
        },
        "base": {
          "value": "24px"
        }
      },
      "letterSpacing": {
        "tight": {
          "value": "-0.025em"
        },
        "wide": {
          "value": "0.025em"
        }
      },
      "fontSize": {
        "xs": {
          "value": "12px"
        },
        "sm": {
          "value": "14px"
        },
        "base": {
          "value": "16px"
        },
        "lg": {
          "value": "18px"
        },
        "xl": {
          "value": "20px"
        },
        "2xl": {
          "value": "24px"
        },
        "3xl": {
          "value": "30px"
        },
        "4xl": {
          "value": "36px"
        },
        "5xl": {
          "value": "48px"
        },
        "6xl": {
          "value": "60px"
        },
        "7xl": {
          "value": "72px"
        },
        "8xl": {
          "value": "96px"
        },
        "9xl": {
          "value": "128px"
        }
      },
      "fontWeight": {
        "thin": {
          "value": "100"
        },
        "extralight": {
          "value": "200"
        },
        "light": {
          "value": "300"
        },
        "normal": {
          "value": "400"
        },
        "medium": {
          "value": "500"
        },
        "semibold": {
          "value": "600"
        },
        "bold": {
          "value": "700"
        },
        "extrabold": {
          "value": "800"
        },
        "black": {
          "value": "900"
        }
      },
      "lead": {
        "1": {
          "value": ".025rem"
        },
        "2": {
          "value": ".5rem"
        },
        "3": {
          "value": ".75rem"
        },
        "4": {
          "value": "1rem"
        },
        "5": {
          "value": "1.25rem"
        },
        "6": {
          "value": "1.5rem"
        },
        "7": {
          "value": "1.75rem"
        },
        "8": {
          "value": "2rem"
        },
        "9": {
          "value": "2.25rem"
        },
        "10": {
          "value": "2.5rem"
        },
        "none": {
          "value": "1"
        },
        "tight": {
          "value": "1.25"
        },
        "snug": {
          "value": "1.375"
        },
        "normal": {
          "value": "1.5"
        },
        "relaxed": {
          "value": "1.625"
        },
        "loose": {
          "value": "2"
        }
      },
      "font": {
        "display": {
          "value": "{font.sans}"
        },
        "body": {
          "value": "{font.sans}"
        },
        "code": {
          "value": "{font.mono}"
        }
      },
      "color": {
        "primary": {
          "50": {
            "value": "{color.primary.50}"
          },
          "100": {
            "value": "{color.primary.100}"
          },
          "200": {
            "value": "{color.primary.200}"
          },
          "300": {
            "value": "{color.primary.300}"
          },
          "400": {
            "value": "{color.primary.400}"
          },
          "500": {
            "value": "{color.primary.500}"
          },
          "600": {
            "value": "{color.primary.600}"
          },
          "700": {
            "value": "{color.primary.700}"
          },
          "800": {
            "value": "{color.primary.800}"
          },
          "900": {
            "value": "{color.primary.900}"
          }
        },
        "secondary": {
          "50": {
            "value": "{color.gray.50}"
          },
          "100": {
            "value": "{color.gray.100}"
          },
          "200": {
            "value": "{color.gray.200}"
          },
          "300": {
            "value": "{color.gray.300}"
          },
          "400": {
            "value": "{color.gray.400}"
          },
          "500": {
            "value": "{color.gray.500}"
          },
          "600": {
            "value": "{color.gray.600}"
          },
          "700": {
            "value": "{color.gray.700}"
          },
          "800": {
            "value": "{color.gray.800}"
          },
          "900": {
            "value": "{color.gray.900}"
          }
        }
      }
    },
    "prose": {
      "p": {
        "fontSize": {
          "value": "{typography.fontSize.base}"
        },
        "lineHeight": {
          "value": "{typography.lead.normal}"
        },
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        },
        "br": {
          "margin": {
            "value": "{typography.verticalMargin.base} 0 0 0"
          }
        }
      },
      "h1": {
        "margin": {
          "value": "0 0 2rem"
        },
        "fontSize": {
          "value": "{typography.fontSize.5xl}"
        },
        "lineHeight": {
          "value": "{typography.lead.tight}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.bold}"
        },
        "letterSpacing": {
          "value": "{typography.letterSpacing.tight}"
        },
        "iconSize": {
          "value": "{typography.fontSize.3xl}"
        }
      },
      "h2": {
        "margin": {
          "value": "3rem 0 2rem"
        },
        "fontSize": {
          "value": "{typography.fontSize.4xl}"
        },
        "lineHeight": {
          "value": "{typography.lead.tight}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        },
        "letterSpacing": {
          "value": "{typography.letterSpacing.tight}"
        },
        "iconSize": {
          "value": "{typography.fontSize.2xl}"
        }
      },
      "h3": {
        "margin": {
          "value": "3rem 0 2rem"
        },
        "fontSize": {
          "value": "{typography.fontSize.3xl}"
        },
        "lineHeight": {
          "value": "{typography.lead.snug}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        },
        "letterSpacing": {
          "value": "{typography.letterSpacing.tight}"
        },
        "iconSize": {
          "value": "{typography.fontSize.xl}"
        }
      },
      "h4": {
        "margin": {
          "value": "3rem 0 2rem"
        },
        "fontSize": {
          "value": "{typography.fontSize.2xl}"
        },
        "lineHeight": {
          "value": "{typography.lead.snug}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        },
        "letterSpacing": {
          "value": "{typography.letterSpacing.tight}"
        },
        "iconSize": {
          "value": "{typography.fontSize.lg}"
        }
      },
      "h5": {
        "margin": {
          "value": "3rem 0 2rem"
        },
        "fontSize": {
          "value": "{typography.fontSize.xl}"
        },
        "lineHeight": {
          "value": "{typography.lead.snug}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        },
        "iconSize": {
          "value": "{typography.fontSize.lg}"
        }
      },
      "h6": {
        "margin": {
          "value": "3rem 0 2rem"
        },
        "fontSize": {
          "value": "{typography.fontSize.lg}"
        },
        "lineHeight": {
          "value": "{typography.lead.normal}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        },
        "iconSize": {
          "value": "{typography.fontSize.base}"
        }
      },
      "strong": {
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        }
      },
      "img": {
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        }
      },
      "a": {
        "textDecoration": {
          "value": "none"
        },
        "color": {
          "static": {
            "value": {
              "initial": "inherit",
              "dark": "inherit"
            }
          },
          "hover": {
            "value": {
              "initial": "{typography.color.primary.500}",
              "dark": "{typography.color.primary.400}"
            }
          }
        },
        "border": {
          "width": {
            "value": "1px"
          },
          "style": {
            "static": {
              "value": "dashed"
            },
            "hover": {
              "value": "solid"
            }
          },
          "color": {
            "static": {
              "value": {
                "initial": "currentColor",
                "dark": "currentColor"
              }
            },
            "hover": {
              "value": {
                "initial": "currentColor",
                "dark": "currentColor"
              }
            }
          },
          "distance": {
            "value": "2px"
          }
        },
        "fontWeight": {
          "value": "{typography.fontWeight.medium}"
        },
        "hasCode": {
          "borderBottom": {
            "value": "none"
          }
        },
        "code": {
          "border": {
            "width": {
              "value": "{prose.a.border.width}"
            },
            "style": {
              "value": "{prose.a.border.style.static}"
            },
            "color": {
              "static": {
                "value": {
                  "initial": "{typography.color.secondary.400}",
                  "dark": "{typography.color.secondary.600}"
                }
              },
              "hover": {
                "value": {
                  "initial": "{typography.color.primary.500}",
                  "dark": "{typography.color.primary.600}"
                }
              }
            }
          },
          "color": {
            "static": {
              "value": {
                "initial": "currentColor",
                "dark": "currentColor"
              }
            },
            "hover": {
              "value": {
                "initial": "currentColor",
                "dark": "currentColor"
              }
            }
          },
          "background": {
            "static": {},
            "hover": {
              "value": {
                "initial": "{typography.color.primary.50}",
                "dark": "{typography.color.primary.900}"
              }
            }
          }
        }
      },
      "blockquote": {
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        },
        "paddingInlineStart": {
          "value": "24px"
        },
        "quotes": {
          "value": "'201C' '201D' '2018' '2019'"
        },
        "color": {
          "value": {
            "initial": "{typography.color.secondary.500}",
            "dark": "{typography.color.secondary.400}"
          }
        },
        "border": {
          "width": {
            "value": "4px"
          },
          "style": {
            "value": "solid"
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.200}",
              "dark": "{typography.color.secondary.700}"
            }
          }
        }
      },
      "ul": {
        "listStyleType": {
          "value": "disc"
        },
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        },
        "paddingInlineStart": {
          "value": "21px"
        },
        "li": {
          "markerColor": {
            "value": {
              "initial": "currentColor",
              "dark": "currentColor"
            }
          }
        }
      },
      "ol": {
        "listStyleType": {
          "value": "decimal"
        },
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        },
        "paddingInlineStart": {
          "value": "21px"
        },
        "li": {
          "markerColor": {
            "value": {
              "initial": "currentColor",
              "dark": "currentColor"
            }
          }
        }
      },
      "li": {
        "margin": {
          "value": "{typography.verticalMargin.sm} 0"
        },
        "listStylePosition": {
          "value": "outside"
        }
      },
      "hr": {
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        },
        "style": {
          "value": "solid"
        },
        "width": {
          "value": "1px"
        },
        "color": {
          "value": {
            "initial": "{typography.color.secondary.200}",
            "dark": "{typography.color.secondary.800}"
          }
        }
      },
      "table": {
        "margin": {
          "value": "{typography.verticalMargin.base} 0"
        },
        "textAlign": {
          "value": "start"
        },
        "fontSize": {
          "value": "{typography.fontSize.sm}"
        },
        "lineHeight": {
          "value": "{typography.lead.6}"
        }
      },
      "thead": {
        "border": {
          "width": {
            "value": "0px"
          },
          "style": {
            "value": "solid"
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.300}",
              "dark": "{typography.color.secondary.600}"
            }
          }
        },
        "borderBottom": {
          "width": {
            "value": "1px"
          },
          "style": {
            "value": "solid"
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.200}",
              "dark": "{typography.color.secondary.800}"
            }
          }
        }
      },
      "th": {
        "color": {
          "value": {
            "initial": "{typography.color.secondary.600}",
            "dark": "{typography.color.secondary.400}"
          }
        },
        "padding": {
          "value": "0 {typography.verticalMargin.sm} {typography.verticalMargin.sm} {typography.verticalMargin.sm}"
        },
        "fontWeight": {
          "value": "{typography.fontWeight.semibold}"
        },
        "textAlign": {
          "value": "inherit"
        }
      },
      "tbody": {
        "tr": {
          "borderBottom": {
            "width": {
              "value": "1px"
            },
            "style": {
              "value": "dashed"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.200}",
                "dark": "{typography.color.secondary.800}"
              }
            }
          }
        },
        "td": {
          "padding": {
            "value": "{typography.verticalMargin.sm}"
          }
        },
        "code": {
          "inline": {
            "fontSize": {
              "value": "{typography.fontSize.sm}"
            }
          }
        }
      },
      "code": {
        "block": {
          "fontSize": {
            "value": "{typography.fontSize.sm}"
          },
          "margin": {
            "value": "{typography.verticalMargin.base} 0"
          },
          "border": {
            "width": {
              "value": "1px"
            },
            "style": {
              "value": "solid"
            },
            "color": {
              "value": {
                "initial": "{typography.color.secondary.200}",
                "dark": "{typography.color.secondary.800}"
              }
            }
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.700}",
              "dark": "{typography.color.secondary.200}"
            }
          },
          "backgroundColor": {
            "value": {
              "initial": "{typography.color.secondary.100}",
              "dark": "{typography.color.secondary.900}"
            }
          },
          "backdropFilter": {
            "value": {
              "initial": "contrast(1)",
              "dark": "contrast(1)"
            }
          },
          "pre": {
            "padding": {
              "value": "{typography.verticalMargin.sm}"
            }
          }
        },
        "inline": {
          "borderRadius": {
            "value": "{radii.xs}"
          },
          "padding": {
            "value": "0.2rem 0.375rem 0.2rem 0.375rem"
          },
          "fontSize": {
            "value": "{typography.fontSize.sm}"
          },
          "fontWeight": {
            "value": "{typography.fontWeight.normal}"
          },
          "color": {
            "value": {
              "initial": "{typography.color.secondary.700}",
              "dark": "{typography.color.secondary.200}"
            }
          },
          "backgroundColor": {
            "value": {
              "initial": "{typography.color.secondary.100}",
              "dark": "{typography.color.secondary.800}"
            }
          }
        }
      }
    },
    "docus": {
      "body": {
        "backgroundColor": {
          "value": {
            "initial": "{color.white}",
            "dark": "{color.black}"
          }
        },
        "color": {
          "value": {
            "initial": "{color.gray.800}",
            "dark": "{color.gray.200}"
          }
        },
        "fontFamily": {
          "value": "{font.sans}"
        }
      },
      "header": {
        "height": {
          "value": "64px"
        },
        "logo": {
          "height": {
            "value": {
              "initial": "{space.6}",
              "sm": "{space.7}"
            }
          }
        },
        "title": {
          "fontSize": {
            "value": "{fontSize.2xl}"
          },
          "fontWeight": {
            "value": "{fontWeight.bold}"
          },
          "color": {
            "static": {
              "value": {
                "initial": "{color.gray.900}",
                "dark": "{color.gray.100}"
              }
            },
            "hover": {
              "value": "{color.primary.500}"
            }
          }
        }
      },
      "footer": {
        "height": {
          "value": {
            "initial": "145px",
            "sm": "100px"
          }
        },
        "padding": {
          "value": "{space.4} 0"
        }
      },
      "readableLine": {
        "value": "78ch"
      },
      "loadingBar": {
        "height": {
          "value": "3px"
        },
        "gradientColorStop1": {
          "value": "#00dc82"
        },
        "gradientColorStop2": {
          "value": "#34cdfe"
        },
        "gradientColorStop3": {
          "value": "#0047e1"
        }
      },
      "search": {
        "backdropFilter": {
          "value": "blur(24px)"
        },
        "input": {
          "borderRadius": {
            "value": "{radii.2xs}"
          },
          "borderWidth": {
            "value": "1px"
          },
          "borderStyle": {
            "value": "solid"
          },
          "borderColor": {
            "value": {
              "initial": "{color.gray.200}",
              "dark": "transparent"
            }
          },
          "fontSize": {
            "value": "{fontSize.sm}"
          },
          "gap": {
            "value": "{space.2}"
          },
          "padding": {
            "value": "{space.2} {space.4}"
          },
          "backgroundColor": {
            "value": {
              "initial": "{color.gray.200}",
              "dark": "{color.gray.800}"
            }
          }
        },
        "results": {
          "window": {
            "marginX": {
              "value": {
                "initial": "0",
                "sm": "{space.4}"
              }
            },
            "borderRadius": {
              "value": {
                "initial": "none",
                "sm": "{radii.xs}"
              }
            },
            "marginTop": {
              "value": {
                "initial": "0",
                "sm": "20vh"
              }
            },
            "maxWidth": {
              "value": "640px"
            },
            "maxHeight": {
              "value": {
                "initial": "100%",
                "sm": "320px"
              }
            }
          },
          "selected": {
            "backgroundColor": {
              "value": {
                "initial": "{color.gray.300}",
                "dark": "{color.gray.700}"
              }
            }
          },
          "highlight": {
            "color": {
              "value": "white"
            },
            "backgroundColor": {
              "value": "{color.primary.500}"
            }
          }
        }
      }
    }
  }
} as const

export const GeneratedPinceauThemeSchema = typeof schema

